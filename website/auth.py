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
        
        # Try to login as user (both regular users and admins)
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password) and user.is_active:
            login_user(user)
            
            # Redirect based on role
            if user.role == 'admin':
                flash('Logged in successfully as admin!', category='success')
                return redirect(url_for('views.admin_dashboard'))
            else:
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
    # Only admins can create new admin accounts
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
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
        elif User.query.filter_by(email=email).first():
            flash('Email already exists.', category='error')
        else:
            # Create new admin user
            new_admin = User(
                email=email,
                firstname=full_name.split()[0] if ' ' in full_name else full_name,
                lastname=full_name.split()[-1] if ' ' in full_name else '',
                contact='0000000000',  # Default contact
                role='admin'
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
    if current_user.role == 'admin':
        return render_template("admin_profile.html")
    return render_template("profile.html")

# Edit Profile
@auth.route('/edit_profile', methods=['GET', 'POST'])
def edit_profile():
    from flask import request, redirect, url_for, flash, render_template
    from flask_login import current_user, login_required
    if request.method == 'POST':
        firstname = request.form.get('firstname')
        lastname = request.form.get('lastname')
        contact = request.form.get('contact')
        if firstname and lastname and contact:
            current_user.firstname = firstname
            current_user.lastname = lastname
            current_user.contact = contact
            from website import db
            db.session.commit()
            flash('Profile updated successfully!', 'success')
            return redirect(url_for('auth.profile'))
        else:
            flash('All fields are required.', 'danger')
    return render_template('edit_profile.html', user=current_user)

# Change Password
@auth.route('/change_password', methods=['GET', 'POST'])
def change_password():
    from flask import request, redirect, url_for, flash, render_template
    from flask_login import current_user, login_required
    if request.method == 'POST':
        old_password = request.form.get('old_password')
        new_password = request.form.get('new_password')
        confirm_password = request.form.get('confirm_password')
        if not current_user.check_password(old_password):
            flash('Old password is incorrect.', 'danger')
        elif new_password != confirm_password:
            flash('New passwords do not match.', 'danger')
        else:
            current_user.set_password(new_password)
            from website import db
            db.session.commit()
            flash('Password changed successfully!', 'success')
            return redirect(url_for('auth.profile'))
    return render_template('change_password.html')

# Notification Settings
@auth.route('/notification_settings', methods=['GET', 'POST'])
def notification_settings():
    from flask import request, redirect, url_for, flash, render_template
    from flask_login import current_user, login_required
    # Example: just a dummy toggle for email notifications
    if request.method == 'POST':
        email_notifications = request.form.get('email_notifications') == 'on'
        current_user.email_notifications = email_notifications
        from website import db
        db.session.commit()
        flash('Notification settings updated!', 'success')
        return redirect(url_for('auth.profile'))
    return render_template('notification_settings.html', user=current_user)

# Remove Export Data
# Add Subscription
@auth.route('/subscription', methods=['GET', 'POST'])
def subscription():
    from flask import request, redirect, url_for, flash, render_template
    from flask_login import current_user, login_required
    if request.method == 'POST':
        subscribe = request.form.get('subscribe') == 'on'
        current_user.subscribed = subscribe
        from website import db
        db.session.commit()
        flash('Subscription status updated!', 'success')
        return redirect(url_for('auth.profile'))
    return render_template('subscription.html', user=current_user)

@auth.route('/admin/users')
@login_required
def admin_users():
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.home'))
    
    users = User.query.all()
    return render_template("admin_users.html", users=users)

@auth.route('/admin/users/<int:user_id>/toggle')
@login_required
def toggle_user_status(user_id):
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.home'))
    
    user = User.query.get_or_404(user_id)
    user.is_active = not user.is_active
    db.session.commit()
    
    status = "activated" if user.is_active else "deactivated"
    flash(f'User {user.email} has been {status}.', category='success')
    return redirect(url_for('auth.admin_users'))

@auth.route('/admin/subscription')
@login_required
def admin_subscription():
    if not current_user.role == 'admin':
        flash('Access denied.', 'error')
        return redirect(url_for('views.home'))
    from .models import User
    subscribed_users = User.query.filter_by(subscribed=True).all()
    return render_template('admin_subscription.html', users=subscribed_users)