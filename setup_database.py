#!/usr/bin/env python3
"""
Database Setup Script for eGrowtify
This script helps set up the database if it doesn't exist.
"""

import mysql.connector
from mysql.connector import Error
import os

def create_database():
    """Create the egrowtify_db database if it doesn't exist"""
    try:
        # Connect without specifying database
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password=''
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create database if it doesn't exist
            cursor.execute("CREATE DATABASE IF NOT EXISTS egrowtify_db")
            print("✅ Database 'egrowtify_db' created or already exists")
            
            cursor.close()
            connection.close()
            return True
            
    except Error as e:
        print(f"❌ Error creating database: {e}")
        return False

def import_sql_file():
    """Import the SQL file to create tables"""
    try:
        # Connect to the specific database
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='egrowtify_db'
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Read and execute SQL file
            sql_file_path = 'egrowtify_db.sql'
            if os.path.exists(sql_file_path):
                with open(sql_file_path, 'r', encoding='utf-8') as file:
                    sql_commands = file.read()
                
                # Split by semicolon and execute each command
                commands = sql_commands.split(';')
                for command in commands:
                    command = command.strip()
                    if command and not command.startswith('--') and not command.startswith('/*'):
                        try:
                            cursor.execute(command)
                        except Error as e:
                            # Ignore errors for existing tables
                            if "already exists" not in str(e):
                                print(f"Warning: {e}")
                
                connection.commit()
                print("✅ SQL file imported successfully")
            else:
                print("❌ SQL file 'egrowtify_db.sql' not found")
                return False
            
            cursor.close()
            connection.close()
            return True
            
    except Error as e:
        print(f"❌ Error importing SQL file: {e}")
        return False

def main():
    print("🔧 Setting up eGrowtify Database...")
    print("=" * 50)
    
    # Step 1: Create database
    print("\n1. Creating database...")
    if create_database():
        print("✅ Database creation successful")
    else:
        print("❌ Database creation failed")
        return
    
    # Step 2: Import SQL schema
    print("\n2. Importing database schema...")
    if import_sql_file():
        print("✅ Schema import successful")
    else:
        print("❌ Schema import failed")
        return
    
    print("\n" + "=" * 50)
    print("🎉 Database setup completed!")
    print("\nNext steps:")
    print("1. Run: python test_db_connection.py")
    print("2. If successful, start the application:")
    print("   - Backend: python main.py")
    print("   - Frontend: npm run dev")

if __name__ == "__main__":
    main()
