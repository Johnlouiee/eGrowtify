from flask import Blueprint, jsonify, request, flash, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from .models import db, User, Admin, UserSubscription, ActivityLog
from .email_service import send_email_verification
from datetime import datetime
import os
import re

auth = Blueprint('auth', __name__)

def log_history_change(table_name, record_id, action, old_values, new_values, changed_by):
    """Log history changes - accesses _HISTORY_LOGS from views module"""
    try:
        # Import at function level to avoid circular imports
        from . import views
        
        field_changes = []
        if old_values and new_values:
            for key in new_values:
                if key in old_values and old_values[key] != new_values[key]:
                    field_changes.append(key)
        elif new_values:
            field_changes = list(new_values.keys())
        elif old_values:
            field_changes = list(old_values.keys())
        
        history_log = {
            'id': len(views._HISTORY_LOGS) + 1,
            'table_name': table_name,
            'record_id': record_id,
            'action': action,
            'old_values': old_values,
            'new_values': new_values,
            'changed_by': changed_by,
            'timestamp': datetime.now().isoformat(),
            'field_changes': field_changes
        }
        views._HISTORY_LOGS.append(history_log)
        print(f"📋 HISTORY LOG: {table_name} - {action} - Record {record_id} by {changed_by}")
    except Exception as e:
        print(f"Error logging history change: {str(e)}")

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return jsonify({"message": "Already logged in", "user_id": current_user.id})
    
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # Try to login as regular user first
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            if not user.email_verified:
                return jsonify({
                    "success": False, 
                    "message": "Please verify your email address before logging in. Check your email for a verification link.",
                    "email_verified": False,
                    "email": user.email
                }), 401
            elif not user.is_active:
                return jsonify({"success": False, "message": "Account is inactive. Please contact support."}), 401
            else:
                login_user(user)
                
                # Log login to history
                try:
                    log_history_change(
                        table_name='users',
                        record_id=user.id,
                        action='LOGIN',
                        old_values={'last_login': None},
                        new_values={'last_login': datetime.now().isoformat()},
                        changed_by=user.email or f"user_{user.id}"
                    )
                except Exception as e:
                    print(f"Error logging login history: {str(e)}")
                
                # Return user info
                return jsonify({
                    "success": True,
                    "message": "Logged in successfully!",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "full_name": user.full_name,
                        "role": user.role,
                        "is_active": user.is_active,
                        "email_verified": user.email_verified,
                        "subscribed": getattr(user, 'subscribed', False),
                        "subscription_plan": getattr(user, 'subscription_plan', 'basic'),
                        # Expose learning level so frontend can personalize experience
                        "learning_level": getattr(user, 'learning_level', 'beginner')
                    },
                    "is_admin": user.is_admin(),
                    "is_premium": getattr(user, 'subscribed', False) or getattr(user, 'subscription_plan', 'basic') == 'premium'
                })
        
        # If not found in User table, try Admin table
        admin = Admin.query.filter_by(email=email).first()
        
        if admin and admin.check_password(password):
            if not admin.is_active:
                return jsonify({"success": False, "message": "Account is inactive. Please contact support."}), 401
            else:
                # Update last login
                admin.last_login = datetime.now()
                db.session.commit()
                
                login_user(admin)
                
                # Log login to history
                try:
                    log_history_change(
                        table_name='admins',
                        record_id=admin.id,
                        action='LOGIN',
                        old_values={'last_login': admin.last_login.isoformat() if admin.last_login else None},
                        new_values={'last_login': datetime.now().isoformat()},
                        changed_by=admin.email or f"admin_{admin.id}"
                    )
                except Exception as e:
                    print(f"Error logging admin login history: {str(e)}")
                
                # Return admin info
                return jsonify({
                    "success": True,
                    "message": "Logged in successfully!",
                    "user": {
                        "id": admin.id,
                        "email": admin.email,
                        "username": admin.username,
                        "full_name": admin.full_name,
                        "is_active": admin.is_active,
                        "is_super_admin": admin.is_super_admin
                    },
                    "is_admin": True,  # Admins are always admins
                    "is_premium": False  # Admins don't have premium status
                })
        
        # If neither user nor admin found
        return jsonify({"success": False, "message": "Invalid credentials."}), 401
    
    return jsonify({"message": "Login endpoint - send POST request with email and password"})

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return jsonify({"message": "Already logged in", "user_id": current_user.id})
    
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        firstname = data.get('firstname')
        lastname = data.get('lastname')
        contact = data.get('contact')
        password1 = data.get('password1')
        password2 = data.get('password2')

        # Validation
        if len(email) < 5:
            return jsonify({"success": False, "message": "Email must be greater than 4 characters."}), 400
        elif len(firstname) < 2:
            return jsonify({"success": False, "message": "First name must be greater than 1 character."}), 400
        elif len(lastname) < 2:
            return jsonify({"success": False, "message": "Last name must be greater than 1 character."}), 400
        elif not re.fullmatch(r"\d{11}", str(contact or "")):
            return jsonify({"success": False, "message": "Phone number must be exactly 11 digits."}), 400
        elif password1 != password2:
            return jsonify({"success": False, "message": "Passwords don't match."}), 400
        elif len(password1) < 7:
            return jsonify({"success": False, "message": "Password must be at least 7 characters."}), 400
        elif User.query.filter_by(email=email).first():
            return jsonify({"success": False, "message": "Email already exists."}), 400
        else:
            # Create new user
            new_user = User(
                email=email,
                firstname=firstname,
                lastname=lastname,
                contact=contact,
                is_active=False  # User is inactive until email is verified
            )
            new_user.set_password(password1)
            
            # Generate email verification token
            verification_token = new_user.generate_email_verification_token()
            
            try:
                db.session.add(new_user)
                db.session.commit()
                
                # Send verification email
                email_sent = send_email_verification(
                    user_email=email,
                    user_name=new_user.full_name,
                    verification_token=verification_token,
                    sender_email=os.getenv('MAIL_SENDER_OVERRIDE') or os.getenv('MAIL_DEFAULT_SENDER') or os.getenv('MAIL_USERNAME')
                )
                
                dev_expose = os.getenv('EXPOSE_VERIFICATION_URL_IN_DEV', 'true').lower() == 'true'
                frontend_base = os.getenv('FRONTEND_URL', 'http://localhost:3000')
                verify_url = f"{frontend_base}/verify-email?token={verification_token}"

                if email_sent:
                    return jsonify({
                        "success": True,
                        "message": "Account created successfully! Please check your email to verify your account.",
                        "email_verification_sent": True,
                        "dev_verification_url": verify_url if dev_expose else None,
                        "user": {
                            "id": new_user.id,
                            "email": new_user.email,
                            "full_name": new_user.full_name,
                            "role": new_user.role,
                            "is_active": new_user.is_active,
                            "email_verified": new_user.email_verified
                        },
                        "is_admin": False
                    })
                else:
                    # Email failed to send, but user was created
                    return jsonify({
                        "success": True,
                        "message": "Account created successfully! However, we couldn't send the verification email. Please contact support.",
                        "email_verification_sent": False,
                        "dev_verification_url": verify_url if dev_expose else None,
                        "user": {
                            "id": new_user.id,
                            "email": new_user.email,
                            "full_name": new_user.full_name,
                            "role": new_user.role,
                            "is_active": new_user.is_active,
                            "email_verified": new_user.email_verified
                        },
                        "is_admin": False
                    })
                    
            except Exception as e:
                db.session.rollback()
                return jsonify({"success": False, "message": "An error occurred while creating the account."}), 500
    
    return jsonify({"message": "Register endpoint - send POST request with user data"})

# Frontend-friendly aliases under /auth/*
@auth.route('/auth/status', methods=['GET'])
def auth_status():
    # Simple caching for auth status to prevent spam
    import time
    current_time = time.time()
    
    # Check if we have cached auth status for this user
    if current_user.is_authenticated:
        user_id = current_user.id
        cache_key = f"auth_status_{user_id}"
        
        # Check cache (5 second TTL for auth status)
        if hasattr(auth_status, '_cache') and cache_key in auth_status._cache:
            cached_data, cache_time = auth_status._cache[cache_key]
            if current_time - cache_time < 5:  # 5 seconds cache
                print(f"🔐 Auth status cache hit for user {user_id}")
                return jsonify(cached_data)
        
        # Initialize cache if not exists
        if not hasattr(auth_status, '_cache'):
            auth_status._cache = {}
        
        # Create fresh auth status data
        user = current_user
        
        # Check if current_user is an Admin instance
        is_admin_user = isinstance(user, Admin)
        
        if is_admin_user:
            # Handle Admin model
            auth_data = {
                "authenticated": True,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                    "full_name": user.full_name,
                    "is_active": user.is_active,
                    "is_super_admin": user.is_super_admin,
                    "created_at": user.created_at.isoformat() if user.created_at else None
                },
                "is_admin": True,  # Admins are always admins
                "is_premium": False  # Admins don't have premium status
            }
        else:
            # Handle User model
            # Check for active subscription
            from .models import UserSubscription
            active_subscription = UserSubscription.query.filter_by(
                user_id=user.id,
                status='active'
            ).first()
            
            # Determine subscription plan from active subscription
            subscription_plan = 'basic'
            if active_subscription and active_subscription.subscription_plan:
                subscription_plan = active_subscription.subscription_plan.plan_type if hasattr(active_subscription.subscription_plan, 'plan_type') else 'premium'
            elif getattr(user, 'subscribed', False):
                subscription_plan = 'premium'
            
            is_premium = getattr(user, 'subscribed', False) or subscription_plan == 'premium'
            
            auth_data = {
                "authenticated": True,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                    "role": user.role,
                    "is_active": user.is_active,
                    "created_at": user.created_at.isoformat() if user.created_at else None,
                    "subscribed": getattr(user, 'subscribed', False),
                    "subscription_plan": subscription_plan,
                    # Include learning level for personalization
                    "learning_level": getattr(user, 'learning_level', 'beginner')
                },
                "is_admin": user.is_admin(),
                "is_premium": is_premium
            }
        
        # Cache the result
        auth_status._cache[cache_key] = (auth_data, current_time)
        print(f"🔐 Auth status cached for user {user_id}")
        return jsonify(auth_data)
    
    return jsonify({"authenticated": False})

@auth.route('/auth/login', methods=['GET', 'POST'])
def login_alias():
    return login()

@auth.route('/auth/register', methods=['GET', 'POST'])
def register_alias():
    return register()

@auth.route('/auth/logout', methods=['POST'])
@login_required
def logout_alias():
    # Get user info before logout
    user_id = current_user.id
    user_email = current_user.email or f"user_{user_id}"
    
    logout_user()
    
    # Log logout to history
    try:
        log_history_change(
            table_name='users',
            record_id=user_id,
            action='LOGOUT',
            old_values={'session_active': True},
            new_values={'session_active': False},
            changed_by=user_email
        )
    except Exception as e:
        print(f"Error logging logout history: {str(e)}")
    
    return jsonify({"success": True, "message": "Logged out successfully"})

@auth.route('/verify-email', methods=['GET', 'POST'])
def verify_email():
    """Verify user email with token"""
    if request.method == 'GET':
        token = request.args.get('token')
    else:
        data = request.get_json()
        token = data.get('token')
    
    if not token:
        return jsonify({"success": False, "message": "Verification token is required."}), 400
    
    # Find user by verification token
    user = User.query.filter_by(email_verification_token=token).first()
    
    if not user:
        return jsonify({"success": False, "message": "Invalid verification token."}), 400
    
    # Check if token is still valid
    if not user.is_email_verification_token_valid(token):
        return jsonify({"success": False, "message": "Verification token has expired. Please request a new one."}), 400
    
    # Verify the email
    user.verify_email()
    user.is_active = True  # Activate the user account
    
    try:
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Email verified successfully! You can now log in to your account.",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "email_verified": user.email_verified,
                "is_active": user.is_active
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": "An error occurred while verifying your email."}), 500

@auth.route('/resend-verification', methods=['POST'])
def resend_verification():
    """Resend verification email"""
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"success": False, "message": "Email is required."}), 400
    
    # Find user by email
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"success": False, "message": "No account found with this email address."}), 400
    
    if user.email_verified:
        return jsonify({"success": False, "message": "Email is already verified."}), 400
    
    # Generate new verification token
    verification_token = user.generate_email_verification_token()
    
    try:
        db.session.commit()
        
        # Send verification email
        email_sent = send_email_verification(
            user_email=email,
            user_name=user.full_name,
            verification_token=verification_token
        )
        
        if email_sent:
            return jsonify({
                "success": True,
                "message": "Verification email sent successfully! Please check your email."
            })
        else:
            return jsonify({
                "success": False,
                "message": "Failed to send verification email. Please try again later."
            }), 500
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": "An error occurred while sending verification email."}), 500

@auth.route('/admin/register', methods=['GET', 'POST'])
@login_required
def admin_register():
    # Only admins can create new admin accounts
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        full_name = data.get('full_name')
        password1 = data.get('password1')
        password2 = data.get('password2')
        is_super_admin = data.get('is_super_admin', False)

        # Validation
        if len(username) < 3:
            return jsonify({"success": False, "message": "Username must be at least 3 characters."}), 400
        elif len(email) < 5:
            return jsonify({"success": False, "message": "Email must be at least 5 characters."}), 400
        elif len(full_name) < 2:
            return jsonify({"success": False, "message": "Full name must be at least 2 characters."}), 400
        elif password1 != password2:
            return jsonify({"success": False, "message": "Passwords don't match."}), 400
        elif len(password1) < 7:
            return jsonify({"success": False, "message": "Password must be at least 7 characters."}), 400
        elif Admin.query.filter_by(username=username).first():
            return jsonify({"success": False, "message": "Username already exists."}), 400
        elif Admin.query.filter_by(email=email).first():
            return jsonify({"success": False, "message": "Email already exists."}), 400
        else:
            # Create new admin
            new_admin = Admin(
                username=username,
                email=email,
                full_name=full_name,
                is_super_admin=is_super_admin
            )
            new_admin.set_password(password1)
            
            try:
                db.session.add(new_admin)
                db.session.commit()
                return jsonify({
                    "success": True,
                    "message": "Admin account created successfully!",
                    "admin_id": new_admin.id
                })
            except Exception as e:
                db.session.rollback()
                return jsonify({"success": False, "message": "An error occurred while creating the admin account."}), 500
    
    return jsonify({"message": "Admin register endpoint - send POST request with admin data"})

@auth.route('/logout')
@login_required
def logout():
    # Get user info before logout
    user_id = current_user.id
    user_email = current_user.email or f"user_{user_id}"
    
    logout_user()
    
    # Log logout to history
    try:
        log_history_change(
            table_name='users',
            record_id=user_id,
            action='LOGOUT',
            old_values={'session_active': True},
            new_values={'session_active': False},
            changed_by=user_email
        )
    except Exception as e:
        print(f"Error logging logout history: {str(e)}")
    
    return jsonify({"success": True, "message": "Logged out successfully!"})

@auth.route('/change-password', methods=['PUT'])
@login_required
def change_password():
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        return jsonify({"success": False, "message": "Both current and new password are required."}), 400
    
    if not current_user.check_password(current_password):
        return jsonify({"success": False, "message": "Current password is incorrect."}), 400
    
    if len(new_password) < 6:
        return jsonify({"success": False, "message": "New password must be at least 6 characters."}), 400
    
    try:
        current_user.set_password(new_password)
        db.session.commit()
        return jsonify({"success": True, "message": "Password changed successfully!"})
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error changing password: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"success": False, "message": f"An error occurred while changing password: {str(e)}"}), 500

@auth.route('/auth/change-password', methods=['PUT'])
@login_required
def change_password_alias():
    """Alias route for change password to match frontend endpoint"""
    return change_password()

@auth.route('/profile', methods=['GET', 'PUT'])
@login_required
def profile():
    if request.method == 'GET':
        return jsonify({
            "user": {
                "id": current_user.id,
                "email": current_user.email,
                "full_name": current_user.full_name,
                "phone": current_user.contact,
                "role": current_user.role,
                "is_active": current_user.is_active,
                "learning_level": getattr(current_user, 'learning_level', 'beginner'),
                "created_at": current_user.created_at.isoformat() if current_user.created_at else None
            }
        })
    
    elif request.method == 'PUT':
        data = request.get_json() or {}

        try:
            # Support "full_name" by splitting into firstname/lastname
            if 'full_name' in data and data['full_name'] is not None:
                full_name = str(data['full_name']).strip()
                if full_name:
                    parts = full_name.split(' ', 1)
                    current_user.firstname = parts[0]
                    current_user.lastname = parts[1] if len(parts) > 1 else ''

            # Allow updating email
            if 'email' in data and data['email']:
                current_user.email = data['email']

            # Map phone to contact column
            if 'phone' in data:
                current_user.contact = data['phone'] or ''

            # Optional: update learning level for personalization (e.g., 'beginner' or 'experienced')
            if 'learning_level' in data and data['learning_level']:
                level = str(data['learning_level']).lower()
                # Allow a small, controlled set of values
                if level in ['beginner', 'intermediate', 'experienced']:
                    current_user.learning_level = level

            db.session.commit()
            return jsonify({
                "success": True,
                "message": "Profile updated successfully!",
                "user": {
                    "id": current_user.id,
                    "email": current_user.email,
                    "full_name": current_user.full_name,
                    "phone": current_user.contact,
                    "role": current_user.role,
                    "is_active": current_user.is_active,
                    "learning_level": getattr(current_user, 'learning_level', 'beginner')
                }
            })
        except Exception as e:
            db.session.rollback()
            return jsonify({"success": False, "message": "An error occurred while updating profile."}), 500

@auth.route('/profile/photo', methods=['POST'])
@login_required
def upload_profile_photo():
    if 'photo' not in request.files:
        return jsonify({"success": False, "message": "No photo provided"}), 400
    file = request.files['photo']
    if file.filename == '':
        return jsonify({"success": False, "message": "Empty filename"}), 400
    try:
        filename = secure_filename(file.filename)
        upload_dir = os.path.join('uploads', 'profiles')
        os.makedirs(upload_dir, exist_ok=True)
        path = os.path.join(upload_dir, f"user_{current_user.id}_{filename}")
        file.save(path)
        # In a real app, you would store this path/url in the DB
        return jsonify({"success": True, "message": "Photo uploaded", "path": path})
    except Exception as e:
        return jsonify({"success": False, "message": "Upload failed"}), 500

@auth.route('/profile/delete', methods=['DELETE'])
@login_required
def delete_account():
    """Delete the current user's account"""
    try:
        data = request.get_json() or {}
        password = data.get('password')
        
        # Verify password is provided
        if not password:
            return jsonify({
                "success": False,
                "message": "Password is required to delete your account"
            }), 400
        
        # Verify password is correct
        if not current_user.check_password(password):
            return jsonify({
                "success": False,
                "message": "Incorrect password. Please enter your current password to delete your account."
            }), 401
        
        user_id = current_user.id
        user_email = current_user.email
        
        # Manually delete records that have foreign keys to avoid SQLAlchemy ORM issues
        # Delete UserSubscription records first (SQLAlchemy tries to update them otherwise)
        UserSubscription.query.filter_by(user_id=user_id).delete()
        
        # Delete ActivityLog records (they don't have CASCADE in the model)
        ActivityLog.query.filter_by(user_id=user_id).delete()
        
        # Commit the deletions before deleting the user
        db.session.commit()
        
        # Now delete the user - cascades will handle other related data (gardens, etc.)
        # For models with SET NULL, user_id will be set to NULL
        db.session.delete(current_user)
        db.session.commit()
        
        # Logout the user after deletion
        logout_user()
        
        return jsonify({
            "success": True,
            "message": "Account deleted successfully. All your data has been removed."
        })
    except Exception as e:
        db.session.rollback()
        import traceback
        error_msg = str(e)
        print(f"Error deleting account for user {user_id if 'user_id' in locals() else 'unknown'}: {error_msg}")
        print(traceback.format_exc())
        return jsonify({
            "success": False, 
            "message": f"An error occurred while deleting your account: {error_msg}"
        }), 500

# Add more API endpoints as needed...