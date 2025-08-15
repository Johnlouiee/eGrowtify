#!/usr/bin/env python3
"""
XAMPP Database Setup Script for eGrowtify
This script helps you import the egrowtifydb.sql file into XAMPP MySQL
"""

import mysql.connector
from mysql.connector import Error
import time
import os
import sys

def wait_for_mysql(max_attempts=10, delay=2):
    """Wait for MySQL to be available"""
    print("🔄 Waiting for MySQL to be ready...")
    
    for attempt in range(max_attempts):
        try:
            connection = mysql.connector.connect(
                host='localhost',
                user='root',
                password='',
                port=3306
            )
            if connection.is_connected():
                print(f"✅ MySQL is ready! (Attempt {attempt + 1})")
                connection.close()
                return True
        except Error as e:
            print(f"⏳ Attempt {attempt + 1}/{max_attempts}: MySQL not ready yet...")
            if attempt < max_attempts - 1:
                print(f"   Waiting {delay} seconds before next attempt...")
                time.sleep(delay)
    
    print("❌ MySQL is not responding")
    print("Please check:")
    print("1. XAMPP is installed and running")
    print("2. MySQL service is started in XAMPP Control Panel")
    return False

def import_sql_file():
    """Import the SQL file into MySQL"""
    print("\n📥 Importing eGrowtify database...")
    
    try:
        # Read the SQL file
        sql_file = 'egrowtifydb.sql'
        if not os.path.exists(sql_file):
            print(f"❌ SQL file '{sql_file}' not found!")
            return False
        
        with open(sql_file, 'r', encoding='utf-8') as file:
            sql_commands = file.read()
        
        # Split into individual commands
        commands = sql_commands.split(';')
        
        # Connect to MySQL
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            port=3306
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            print("   🔄 Executing SQL commands...")
            for i, command in enumerate(commands):
                command = command.strip()
                if command and not command.startswith('--'):
                    try:
                        cursor.execute(command)
                        if i % 5 == 0:  # Show progress every 5 commands
                            print(f"   ⚡ Processed {i+1}/{len(commands)} commands...")
                    except Error as e:
                        if "already exists" not in str(e).lower():
                            print(f"   ⚠️ Warning on command {i+1}: {e}")
            
            connection.commit()
            cursor.close()
            connection.close()
            
            print("   ✅ Database import completed!")
            return True
            
    except Error as e:
        print(f"❌ Error importing database: {e}")
        return False

def verify_database():
    """Verify the database was created correctly"""
    print("\n🔍 Verifying database setup...")
    
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='egrowtifydb',
            port=3306
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Check tables
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            table_names = [table[0] for table in tables]
            
            expected_tables = ['users', 'admins', 'garden', 'plant', 'planttracking', 'feedback', 'notifications']
            
            print("   📋 Tables found:")
            for table in table_names:
                status = "✅" if table in expected_tables else "❌"
                print(f"   {status} {table}")
            
            # Check sample data
            cursor.execute("SELECT COUNT(*) FROM plant")
            plant_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM users")
            user_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM admins")
            admin_count = cursor.fetchone()[0]
            
            cursor.close()
            connection.close()
            
            print(f"\n   📊 Sample data:")
            print(f"   🌱 Plants: {plant_count}")
            print(f"   👥 Users: {user_count}")
            print(f"   👨‍💼 Admins: {admin_count}")
            
            return True
            
    except Error as e:
        print(f"❌ Error verifying database: {e}")
        return False

def update_flask_config():
    """Update Flask configuration to use the new database"""
    print("\n⚙️ Updating Flask configuration...")
    
    try:
        # Update website/__init__.py
        init_file = 'website/__init__.py'
        if os.path.exists(init_file):
            with open(init_file, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Replace database name
            content = content.replace("'egrowtify_db'", "'egrowtifydb'")
            content = content.replace("mysql://root:@localhost/egrowtify_db", "mysql://root:@localhost:3306/egrowtifydb")
            
            with open(init_file, 'w', encoding='utf-8') as file:
                file.write(content)
            
            print("   ✅ Updated website/__init__.py")
        
        return True
        
    except Exception as e:
        print(f"❌ Error updating Flask config: {e}")
        return False

def main():
    print("🚀 Setting up eGrowtify Database in XAMPP")
    print("=" * 60)
    
    # Step 1: Wait for MySQL
    if not wait_for_mysql():
        return
    
    # Step 2: Import SQL file
    if not import_sql_file():
        return
    
    # Step 3: Verify database
    if not verify_database():
        return
    
    # Step 4: Update Flask config
    if not update_flask_config():
        return
    
    print("\n" + "=" * 60)
    print("🎉 Database setup completed successfully!")
    print("\n📋 Database Information:")
    print("   • Database Name: egrowtifydb")
    print("   • Host: localhost")
    print("   • Port: 3306")
    print("   • User: root")
    print("   • Password: (empty)")
    print("\n📊 Created Tables:")
    print("   • users - User accounts and profiles")
    print("   • admins - Administrator accounts")
    print("   • garden - User gardens")
    print("   • plant - Plant database (15 sample plants)")
    print("   • planttracking - Plant care tracking")
    print("   • feedback - User feedback system")
    print("   • notifications - Smart alerts system")
    print("\n🔑 Default Accounts:")
    print("   • Admin: admin@egrowtify.com / admin123")
    print("   • User: john.doe@example.com / testpass123")
    print("\n🚀 Next Steps:")
    print("1. Start Flask backend: python main.py")
    print("2. Start React frontend: npm run dev")
    print("3. Visit http://localhost:3000")
    print("4. Login with the provided accounts")
    print("\n💡 All eGrowtify features are now ready!")

if __name__ == "__main__":
    main()
