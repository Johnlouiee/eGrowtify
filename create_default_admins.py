#!/usr/bin/env python3
"""
Create default admin accounts for eGrowtify
This script creates 3 default admin accounts using the existing users table.
"""

from website import create_app, db
from website.models import User

def create_default_admins():
    app = create_app()
    
    with app.app_context():
        # Define 3 default admin accounts
        admin_accounts = [
            {
                'email': 'admin@egrowtify.com',
                'firstname': 'System',
                'lastname': 'Administrator',
                'contact': '1234567890',
                'password': 'admin123',
                'role': 'admin'
            },
            {
                'email': 'superadmin@egrowtify.com',
                'firstname': 'Super',
                'lastname': 'Admin',
                'contact': '0987654321',
                'password': 'super123',
                'role': 'admin'
            },
            {
                'email': 'manager@egrowtify.com',
                'firstname': 'Garden',
                'lastname': 'Manager',
                'contact': '5555555555',
                'password': 'manager123',
                'role': 'admin'
            }
        ]
        
        created_count = 0
        
        for admin_data in admin_accounts:
            # Check if admin already exists
            existing_admin = User.query.filter_by(email=admin_data['email']).first()
            
            if existing_admin:
                print(f"Admin account already exists: {admin_data['email']}")
                continue
            
            # Create new admin account
            admin = User(
                email=admin_data['email'],
                firstname=admin_data['firstname'],
                lastname=admin_data['lastname'],
                contact=admin_data['contact'],
                role=admin_data['role'],
                is_active=True
            )
            admin.set_password(admin_data['password'])
            
            try:
                db.session.add(admin)
                db.session.commit()
                created_count += 1
                print(f"✅ Created admin account: {admin_data['email']}")
            except Exception as e:
                db.session.rollback()
                print(f"❌ Error creating admin account {admin_data['email']}: {e}")
        
        if created_count > 0:
            print(f"\n🎉 Successfully created {created_count} admin account(s)!")
            print("\n📋 Default Admin Login Credentials:")
            print("=" * 50)
            for admin_data in admin_accounts:
                print(f"Email: {admin_data['email']}")
                print(f"Password: {admin_data['password']}")
                print(f"Name: {admin_data['firstname']} {admin_data['lastname']}")
                print("-" * 30)
        else:
            print("\nℹ️  All admin accounts already exist!")
        
        print("\n🔐 You can now login as admin using any of these credentials.")
        print("💡 Remember to change the default passwords after first login!")

if __name__ == "__main__":
    print("🚀 Creating default admin accounts...")
    create_default_admins() 