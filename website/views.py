from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from . import mysql
from .models import db, User, Admin

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template("home.html")

@views.route('/test_db')
def test_db():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT DATABASE()")
        data = cur.fetchone()
        cur.close()
        return f"Connected to database: {data[0]}"
    except Exception as e:
        return f"Database connection error: {str(e)}"

@views.route('/user/dashboard')
@login_required
def user_dashboard():
    if isinstance(current_user, Admin):
        flash('Admins should use the admin dashboard.', category='info')
        return redirect(url_for('views.admin_dashboard'))
    
    return render_template("user_dashboard.html")

@views.route('/admin/dashboard')
@login_required
def admin_dashboard():
    if not isinstance(current_user, Admin):
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.user_dashboard'))
    
    # Get some basic stats
    total_users = User.query.count()
    active_users = User.query.filter_by(is_active=True).count()
    total_admins = Admin.query.count()
    
    return render_template("admin_dashboard.html", 
                         total_users=total_users,
                         active_users=active_users,
                         total_admins=total_admins)

@views.route('/admin/stats')
@login_required
def admin_stats():
    if not isinstance(current_user, Admin):
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.home'))
    
    # Get detailed statistics
    users = User.query.all()
    admins = Admin.query.all()
    
    return render_template("admin_stats.html", users=users, admins=admins)
