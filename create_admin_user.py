#!/usr/bin/env python3
"""
Script to create an admin user for testing the admin panel.
Run this script to create an admin user with email: admin@egrowtify.com
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from website import create_app, db
from website.models import User
from werkzeug.security import generate_password_hash

def create_admin_user():
    app = create_app()
    
    with app.app_context():
        # Check if admin user already exists
        existing_admin = User.query.filter_by(email='admin@egrowtify.com').first()
        if existing_admin:
            print("Admin user already exists!")
            print(f"Email: {existing_admin.email}")
            print(f"Role: {existing_admin.role}")
            return
        
        # Create admin user
        admin_user = User(
            email='admin@egrowtify.com',
            firstname='Admin',
            lastname='User',
            contact='1234567890',
            role='admin',
            is_active=True,
            email_verified=True,
            subscribed=True,
            learning_level='expert'
        )
        admin_user.set_password('admin123')  # Default password
        
        try:
            db.session.add(admin_user)
            db.session.commit()
            print("✅ Admin user created successfully!")
            print("Email: admin@egrowtify.com")
            print("Password: admin123")
            print("Role: admin")
            print("\nYou can now log in with these credentials to access the admin panel.")
        except Exception as e:
            print(f"❌ Error creating admin user: {e}")
            db.session.rollback()

if __name__ == '__main__':
    create_admin_user()
