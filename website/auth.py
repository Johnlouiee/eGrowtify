from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash
from .models import db, User, Admin
from datetime import datetime

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('views.home'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user_type = request.form.get('user_type', 'user')  # 'user' or 'admin'
        
        if user_type == 'admin':
            # Try to login as admin
            admin = Admin.query.filter_by(email=email).first()
            if admin and admin.check_password(password) and admin.is_active:
                login_user(admin)
                admin.last_login = datetime.utcnow()
                db.session.commit()
                flash('Logged in successfully as admin!', category='success')
                return redirect(url_for('views.admin_dashboard'))
            else:
                flash('Invalid admin credentials or account inactive.', category='error')
        else:
            # Try to login as user
            user = User.query.filter_by(email=email).first()
            if user and user.check_password(password) and user.is_active:
                login_user(user)
                flash('Logged in successfully!', category='success')
                return redirect(url_for('views.user_dashboard'))
            else:
                flash('Invalid credentials or account inactive.', category='error')
    
    return render_template("login.html")

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('views.home'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        firstname = request.form.get('firstname')
        lastname = request.form.get('lastname')
        contact = request.form.get('contact')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        # Validation
        if len(email) < 5:
            flash('Email must be greater than 4 characters.', category='error')
        elif len(firstname) < 2:
            flash('First name must be greater than 1 character.', category='error')
        elif len(lastname) < 2:
            flash('Last name must be greater than 1 character.', category='error')
        elif len(contact) < 10:
            flash('Contact number must be at least 10 digits.', category='error')
        elif password1 != password2:
            flash('Passwords don\'t match.', category='error')
        elif len(password1) < 7:
            flash('Password must be at least 7 characters.', category='error')
        elif User.query.filter_by(email=email).first():
            flash('Email already exists.', category='error')
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
                flash('Account created successfully!', category='success')
                return redirect(url_for('auth.login'))
            except Exception as e:
                db.session.rollback()
                flash('An error occurred while creating the account.', category='error')
    
    return render_template("register.html")

@auth.route('/admin/register', methods=['GET', 'POST'])
@login_required
def admin_register():
    # Only super admins can create new admin accounts
    if not isinstance(current_user, Admin) or not current_user.is_super_admin:
        flash('Access denied. Only super admins can create admin accounts.', category='error')
        return redirect(url_for('views.admin_dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        full_name = request.form.get('full_name')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')
        is_super_admin = request.form.get('is_super_admin') == 'on'

        # Validation
        if len(username) < 3:
            flash('Username must be at least 3 characters.', category='error')
        elif len(full_name) < 2:
            flash('Full name must be at least 2 characters.', category='error')
        elif password1 != password2:
            flash('Passwords don\'t match.', category='error')
        elif len(password1) < 7:
            flash('Password must be at least 7 characters.', category='error')
        elif Admin.query.filter_by(username=username).first():
            flash('Username already exists.', category='error')
        elif Admin.query.filter_by(email=email).first():
            flash('Email already exists.', category='error')
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
                flash('Admin account created successfully!', category='success')
                return redirect(url_for('views.admin_dashboard'))
            except Exception as e:
                db.session.rollback()
                flash('An error occurred while creating the admin account.', category='error')
    
    return render_template("admin_register.html")

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully!', category='success')
    return redirect(url_for('views.home'))

@auth.route('/profile')
@login_required
def profile():
    return render_template("profile.html")

@auth.route('/admin/users')
@login_required
def admin_users():
    if not isinstance(current_user, Admin):
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.home'))
    
    users = User.query.all()
    return render_template("admin_users.html", users=users)

@auth.route('/admin/users/<int:user_id>/toggle')
@login_required
def toggle_user_status(user_id):
    if not isinstance(current_user, Admin):
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.home'))
    
    user = User.query.get_or_404(user_id)
    user.is_active = not user.is_active
    db.session.commit()
    
    status = "activated" if user.is_active else "deactivated"
    flash(f'User {user.email} has been {status}.', category='success')
    return redirect(url_for('auth.admin_users'))