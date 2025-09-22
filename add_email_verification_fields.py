#!/usr/bin/env python3
"""
Database migration script to add email verification fields to the users table.
Run this script after updating the models to add the new email verification columns.
"""

import os
import sys
from flask import Flask
from flask_mysqldb import MySQL
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def add_email_verification_fields():
    """Add email verification fields to the users table"""
    
    # Load environment variables
    load_dotenv()
    
    # Create Flask app for database connection
    app = Flask(__name__)
    
    # MySQL Configuration
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = ''
    app.config['MYSQL_DB'] = 'egrowtifydb'
    
    mysql = MySQL(app)
    
    try:
        with app.app_context():
            cursor = mysql.connection.cursor()
            
            print("🔧 Adding email verification fields to users table...")
            
            # Check if columns already exist
            cursor.execute("""
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = 'egrowtifydb' 
                AND TABLE_NAME = 'users' 
                AND COLUMN_NAME IN ('email_verified', 'email_verification_token', 'email_verification_expires')
            """)
            
            existing_columns = [row[0] for row in cursor.fetchall()]
            
            # Add email_verified column if it doesn't exist
            if 'email_verified' not in existing_columns:
                cursor.execute("""
                    ALTER TABLE users 
                    ADD COLUMN email_verified BOOLEAN DEFAULT FALSE
                """)
                print("✅ Added email_verified column")
            else:
                print("ℹ️  email_verified column already exists")
            
            # Add email_verification_token column if it doesn't exist
            if 'email_verification_token' not in existing_columns:
                cursor.execute("""
                    ALTER TABLE users 
                    ADD COLUMN email_verification_token VARCHAR(100) UNIQUE
                """)
                print("✅ Added email_verification_token column")
            else:
                print("ℹ️  email_verification_token column already exists")
            
            # Add email_verification_expires column if it doesn't exist
            if 'email_verification_expires' not in existing_columns:
                cursor.execute("""
                    ALTER TABLE users 
                    ADD COLUMN email_verification_expires DATETIME
                """)
                print("✅ Added email_verification_expires column")
            else:
                print("ℹ️  email_verification_expires column already exists")
            
            # Commit changes
            mysql.connection.commit()
            
            print("\n🎉 Email verification fields added successfully!")
            print("\n📋 Summary:")
            print("   - email_verified: Boolean field to track verification status")
            print("   - email_verification_token: Unique token for verification")
            print("   - email_verification_expires: Token expiration timestamp")
            
            print("\n⚠️  Important Notes:")
            print("   - All existing users will have email_verified = FALSE")
            print("   - Existing users will need to verify their emails to log in")
            print("   - You may want to manually verify admin accounts")
            
    except Exception as e:
        print(f"❌ Error adding email verification fields: {str(e)}")
        return False
    
    finally:
        if 'cursor' in locals():
            cursor.close()
    
    return True

if __name__ == "__main__":
    print("🚀 eGrowtify Database Migration: Email Verification")
    print("=" * 50)
    
    success = add_email_verification_fields()
    
    if success:
        print("\n✅ Migration completed successfully!")
        print("\n🔧 Next steps:")
        print("   1. Update your .env file with email configuration")
        print("   2. Install Flask-Mail: pip install Flask-Mail==0.9.1")
        print("   3. Restart your Flask application")
        print("   4. Test the email verification flow")
    else:
        print("\n❌ Migration failed. Please check the error messages above.")
        sys.exit(1)
