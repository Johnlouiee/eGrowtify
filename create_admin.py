#!/usr/bin/env python3
"""
Create Admin Accounts for eGrowtify
This script creates default admin accounts with properly hashed passwords
"""

import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from website import create_app, db
from website.models import User
from werkzeug.security import generate_password_hash

def create_admin_accounts():
    """Create default admin accounts"""
    
    app = create_app()
    
    with app.app_context():
        # Check if admin accounts already exist
        existing_admin = User.query.filter_by(role='admin').first()
        if existing_admin:
            print("⚠️  Admin accounts already exist!")
            print(f"Found admin: {existing_admin.email}")
            return
        
        # Create admin accounts
        admin_accounts = [
            {
                'email': 'admin@egrowtify.com',
                'firstname': 'Admin',
                'lastname': 'User',
                'contact': '1234567890',
                'password': 'admin123',
                'role': 'admin'
            },
            {
                'email': 'superadmin@egrowtify.com',
                'firstname': 'Super',
                'lastname': 'Admin',
                'contact': '0987654321',
                'password': 'superadmin123',
                'role': 'admin'
            }
        ]
        
        for account in admin_accounts:
            # Check if user already exists
            existing_user = User.query.filter_by(email=account['email']).first()
            if existing_user:
                print(f"⚠️  User {account['email']} already exists, skipping...")
                continue
            
            # Create new admin user
            new_admin = User(
                email=account['email'],
                firstname=account['firstname'],
                lastname=account['lastname'],
                contact=account['contact'],
                role=account['role'],
                subscribed=True,
                email_notifications=True,
                learning_level='expert'
            )
            new_admin.set_password(account['password'])
            
            try:
                db.session.add(new_admin)
                db.session.commit()
                print(f"✅ Created admin account: {account['email']}")
                print(f"   Password: {account['password']}")
            except Exception as e:
                db.session.rollback()
                print(f"❌ Error creating admin account {account['email']}: {e}")
        
        # Verify admin accounts
        admin_users = User.query.filter_by(role='admin').all()
        print(f"\n📋 Total admin accounts: {len(admin_users)}")
        for admin in admin_users:
            print(f"   - {admin.email} ({admin.firstname} {admin.lastname})")

if __name__ == "__main__":
    print("🚀 Creating admin accounts for eGrowtify...")
    create_admin_accounts()
    print("🎉 Admin account creation completed!")
    print("\n📝 Login Credentials:")
    print("   Email: admin@egrowtify.com")
    print("   Password: admin123")
    print("\n   Email: superadmin@egrowtify.com")
    print("   Password: superadmin123") 