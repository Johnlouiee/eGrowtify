from flask import Blueprint, jsonify, request, flash, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash
from .models import db, User, Admin
from datetime import datetime

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
        
        if user and user.check_password(password) and user.is_active:
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
                    "is_active": user.is_active
                }
            })
        else:
            return jsonify({"success": False, "error": "Invalid credentials or account inactive."}), 401
    
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
            return jsonify({"success": False, "error": "Email must be greater than 4 characters."}), 400
        elif len(firstname) < 2:
            return jsonify({"success": False, "error": "First name must be greater than 1 character."}), 400
        elif len(lastname) < 2:
            return jsonify({"success": False, "error": "Last name must be greater than 1 character."}), 400
        elif len(contact) < 10:
            return jsonify({"success": False, "error": "Contact number must be at least 10 digits."}), 400
        elif password1 != password2:
            return jsonify({"success": False, "error": "Passwords don't match."}), 400
        elif len(password1) < 7:
            return jsonify({"success": False, "error": "Password must be at least 7 characters."}), 400
        elif User.query.filter_by(email=email).first():
            return jsonify({"success": False, "error": "Email already exists."}), 400
        else:
            # Create new user
            new_user = User(
                email=email,
                firstname=firstname,
                lastname=lastname,
                contact=contact
            )
            new_user.set_password(password1)
            
            try:
                db.session.add(new_user)
                db.session.commit()
                return jsonify({
                    "success": True,
                    "message": "Account created successfully!",
                    "user_id": new_user.id
                })
            except Exception as e:
                db.session.rollback()
                return jsonify({"success": False, "error": "An error occurred while creating the account."}), 500
    
    return jsonify({"message": "Register endpoint - send POST request with user data"})

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
            return jsonify({"success": False, "error": "Username must be at least 3 characters."}), 400
        elif len(email) < 5:
            return jsonify({"success": False, "error": "Email must be at least 5 characters."}), 400
        elif len(full_name) < 2:
            return jsonify({"success": False, "error": "Full name must be at least 2 characters."}), 400
        elif password1 != password2:
            return jsonify({"success": False, "error": "Passwords don't match."}), 400
        elif len(password1) < 7:
            return jsonify({"success": False, "error": "Password must be at least 7 characters."}), 400
        elif Admin.query.filter_by(username=username).first():
            return jsonify({"success": False, "error": "Username already exists."}), 400
        elif Admin.query.filter_by(email=email).first():
            return jsonify({"success": False, "error": "Email already exists."}), 400
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
                return jsonify({"success": False, "error": "An error occurred while creating the admin account."}), 500
    
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
        return jsonify({"success": False, "error": "Both current and new password are required."}), 400
    
    if not current_user.check_password(current_password):
        return jsonify({"success": False, "error": "Current password is incorrect."}), 400
    
    if len(new_password) < 6:
        return jsonify({"success": False, "error": "New password must be at least 6 characters."}), 400
    
    try:
        current_user.set_password(new_password)
        db.session.commit()
        return jsonify({"success": True, "message": "Password changed successfully!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": "An error occurred while changing password."}), 500

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
            return jsonify({"success": False, "error": "An error occurred while updating profile."}), 500

# Add more API endpoints as needed...