#!/usr/bin/env python3
"""
Test script to verify primary_crop_focus column exists and works correctly
"""

import os
import sys
from flask import Flask
from flask_mysqldb import MySQL
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_primary_crop_focus():
    """Test that primary_crop_focus column exists and can be queried"""
    
    # Load environment variables
    load_dotenv()
    
    # Create Flask app for database connection
    app = Flask(__name__)
    
    # MySQL Configuration from environment variables
    app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
    app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
    app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', '')
    app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'egrowtifydb')
    
    mysql = MySQL(app)
    
    try:
        with app.app_context():
            cursor = mysql.connection.cursor()
            
            # Check if column exists
            cursor.execute("""
                SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = %s 
                AND TABLE_NAME = 'users' 
                AND COLUMN_NAME = 'primary_crop_focus'
            """, (app.config['MYSQL_DB'],))
            
            result = cursor.fetchone()
            
            if result:
                print(f"[OK] Column 'primary_crop_focus' exists!")
                print(f"   Type: {result[1]}")
                print(f"   Nullable: {result[2]}")
                
                # Test querying a user
                cursor.execute("SELECT id, email, primary_crop_focus FROM users LIMIT 1")
                user = cursor.fetchone()
                if user:
                    print(f"\n[OK] Test query successful!")
                    print(f"   User ID: {user[0]}")
                    print(f"   Email: {user[1]}")
                    print(f"   Primary Crop Focus: {user[2] if user[2] else 'NULL (not set)'}")
                else:
                    print("\n[WARN] No users found in database")
            else:
                print("[ERROR] Column 'primary_crop_focus' does NOT exist!")
                print("   Please run: python add_primary_crop_focus_field.py")
            
            cursor.close()
            
    except Exception as e:
        print(f"[ERROR] Error testing primary_crop_focus field: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    print("Testing primary_crop_focus column...")
    print("=" * 50)
    test_primary_crop_focus()
    print("\nTest completed!")
