#!/usr/bin/env python3
"""
Simple database connection test
"""

import pymysql
from sqlalchemy import create_engine, text

def test_pymysql():
    """Test direct PyMySQL connection"""
    try:
        print("🔍 Testing PyMySQL connection...")
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            database='egrowtify_db',
            port=3306
        )
        print("✅ PyMySQL connection successful!")
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM users")
            result = cursor.fetchone()
            print(f"   Users table has {result[0]} records")
            
        connection.close()
        return True
    except Exception as e:
        print(f"❌ PyMySQL connection failed: {e}")
        return False

def test_sqlalchemy():
    """Test SQLAlchemy connection"""
    try:
        print("\n🔍 Testing SQLAlchemy connection...")
        engine = create_engine('mysql+pymysql://root:@localhost/egrowtify_db?charset=utf8mb4')
        
        with engine.connect() as connection:
            result = connection.execute(text("SELECT COUNT(*) FROM users"))
            count = result.fetchone()[0]
            print(f"✅ SQLAlchemy connection successful!")
            print(f"   Users table has {count} records")
        
        return True
    except Exception as e:
        print(f"❌ SQLAlchemy connection failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Simple Database Connection Test")
    print("=" * 40)
    
    pymysql_ok = test_pymysql()
    sqlalchemy_ok = test_sqlalchemy()
    
    print("\n" + "=" * 40)
    if pymysql_ok and sqlalchemy_ok:
        print("🎉 All tests passed! Database is working.")
    else:
        print("❌ Some tests failed. Check your database setup.")
