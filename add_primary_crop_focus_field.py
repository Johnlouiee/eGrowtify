#!/usr/bin/env python3
"""
Database migration script to add primary_crop_focus field to the users table.
Run this script after updating the models to add the new primary_crop_focus column.
"""

import os
import sys
from flask import Flask
from flask_mysqldb import MySQL
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def add_primary_crop_focus_field():
    """Add primary_crop_focus field to the users table"""
    
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
            
            # Check if column already exists
            cursor.execute("""
                SELECT COUNT(*) 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = %s 
                AND TABLE_NAME = 'users' 
                AND COLUMN_NAME = 'primary_crop_focus'
            """, (app.config['MYSQL_DB'],))
            
            column_exists = cursor.fetchone()[0] > 0
            
            if column_exists:
                print("Column 'primary_crop_focus' already exists in users table. Skipping migration.")
            else:
                # Add primary_crop_focus column
                print("Adding 'primary_crop_focus' column to users table...")
                cursor.execute("""
                    ALTER TABLE users 
                    ADD COLUMN primary_crop_focus VARCHAR(20) NULL 
                    AFTER learning_level
                """)
                
                mysql.connection.commit()
                print("Successfully added 'primary_crop_focus' column to users table!")
            
            cursor.close()
            
    except Exception as e:
        print(f"Error adding primary_crop_focus field: {e}")
        sys.exit(1)

if __name__ == '__main__':
    add_primary_crop_focus_field()
