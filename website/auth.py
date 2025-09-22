from flask import Blueprint, jsonify, request, flash, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash
from .models import db, User, Admin
from .email_service import send_email_verification
from datetime import datetime
import os
import re

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return jsonify({"message": "Already logged in", "user_id": current_user.id})
    
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # Try to login as user (both regular users and admins)
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
                        "email_verified": user.email_verified
                    },
                    "is_admin": user.is_admin()
                })
        else:
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
    if current_user.is_authenticated:
        user = current_user
        return jsonify({
            "authenticated": True,
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role
            },
            "is_admin": user.is_admin()
        })
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
    logout_user()
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
    logout_user()
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
        return jsonify({"success": False, "message": "An error occurred while changing password."}), 500

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
                "created_at": current_user.created_at.isoformat() if current_user.created_at else None
            }
        })
    
    elif request.method == 'PUT':
        data = request.get_json()
        
        try:
            if 'full_name' in data:
                current_user.full_name = data['full_name']
            if 'email' in data:
                current_user.email = data['email']
            if 'phone' in data:
                current_user.contact = data['phone']
            
            db.session.commit()
            return jsonify({"success": True, "message": "Profile updated successfully!"})
        except Exception as e:
            db.session.rollback()
            return jsonify({"success": False, "message": "An error occurred while updating profile."}), 500

# Add more API endpoints as needed...