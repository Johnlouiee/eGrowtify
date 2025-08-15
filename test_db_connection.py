#!/usr/bin/env python3
"""
Database Connection Test Script for eGrowtify
This script tests if the MySQL database connection is working properly.
"""

import mysql.connector
from mysql.connector import Error

def test_mysql_connection():
    """Test MySQL connection with the configured settings"""
    try:
        # Connection parameters (same as in website/__init__.py)
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='egrowtify_db'
        )
        
        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"✅ Successfully connected to MySQL Server version {db_info}")
            
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE();")
            database_name = cursor.fetchone()[0]
            print(f"✅ Connected to database: {database_name}")
            
            # Test if tables exist
            cursor.execute("SHOW TABLES;")
            tables = cursor.fetchall()
            print(f"✅ Found {len(tables)} tables in the database:")
            for table in tables:
                print(f"   - {table[0]}")
            
            cursor.close()
            connection.close()
            print("✅ Database connection test completed successfully!")
            return True
            
    except Error as e:
        print(f"❌ Error connecting to MySQL: {e}")
        return False

def test_sqlalchemy_connection():
    """Test SQLAlchemy connection"""
    try:
        from website import create_app
        from website.models import db
        
        app = create_app()
        with app.app_context():
            # Test database connection
            db.engine.execute("SELECT 1")
            print("✅ SQLAlchemy connection test successful!")
            return True
            
    except Exception as e:
        print(f"❌ Error with SQLAlchemy connection: {e}")
        return False

def main():
    print("🔍 Testing eGrowtify Database Connection...")
    print("=" * 50)
    
    # Test 1: Direct MySQL connection
    print("\n1. Testing direct MySQL connection...")
    mysql_success = test_mysql_connection()
    
    # Test 2: SQLAlchemy connection
    print("\n2. Testing SQLAlchemy connection...")
    sqlalchemy_success = test_sqlalchemy_connection()
    
    print("\n" + "=" * 50)
    if mysql_success and sqlalchemy_success:
        print("🎉 All database tests passed! Your database is ready.")
        print("\nNext steps:")
        print("1. Start the Flask backend: python main.py")
        print("2. Start the React frontend: npm run dev")
        print("3. Visit http://localhost:3000 to create an account")
    else:
        print("❌ Database connection failed!")
        print("\nTroubleshooting steps:")
        print("1. Make sure XAMPP is installed and MySQL is running")
        print("2. Check that the database 'egrowtify_db' exists")
        print("3. Verify the database was imported from egrowtify_db.sql")
        print("4. Check that MySQL is running on localhost:3306")
        print("5. Verify the root user has no password (default XAMPP setting)")

if __name__ == "__main__":
    main()
