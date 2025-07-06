#!/usr/bin/env python3
"""
Database reset script for eGrowtify
This script will drop and recreate the database with the correct schema.
"""

import mysql.connector
from mysql.connector import Error

def reset_database():
    try:
        # Connect to MySQL server (without specifying database)
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password=''
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Drop database if it exists
            print("Dropping existing database...")
            cursor.execute("DROP DATABASE IF EXISTS egrowtify_db")
            
            # Create new database
            print("Creating new database...")
            cursor.execute("CREATE DATABASE egrowtify_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci")
            
            # Use the new database
            cursor.execute("USE egrowtify_db")
            
            # Create users table
            print("Creating users table...")
            cursor.execute("""
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(120) NOT NULL UNIQUE,
                    firstname VARCHAR(50) NOT NULL,
                    lastname VARCHAR(50) NOT NULL,
                    contact VARCHAR(20) NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    role VARCHAR(20) DEFAULT 'user',
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
            """)
            
            # Create admins table
            print("Creating admins table...")
            cursor.execute("""
                CREATE TABLE admins (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(80) NOT NULL UNIQUE,
                    email VARCHAR(120) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    full_name VARCHAR(100) NOT NULL,
                    is_super_admin BOOLEAN DEFAULT FALSE,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_login DATETIME NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
            """)
            
            print("Database reset completed successfully!")
            print("You can now run your Flask application.")
            
    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection closed.")

if __name__ == "__main__":
    print("Starting database reset...")
    reset_database() 