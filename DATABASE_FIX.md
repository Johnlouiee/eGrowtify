# Database Fix for "Server has gone away" Error

## Problem
You're getting a MySQL "Server has gone away" error because there's a mismatch between your SQLAlchemy models and your MySQL database schema.

## Solution

### Step 1: Install Required Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Reset Your Database
Run the database reset script to create the correct schema:

```bash
python reset_database.py
```

This script will:
- Drop the existing `egrowtify_db` database
- Create a new database with the correct schema
- Create the `users` and `admins` tables with proper column names

### Step 3: Run Your Application
After resetting the database, you can run your Flask application:

```bash
python main.py
```

## What Was Fixed

1. **Column Name Mismatch**: Your SQLAlchemy models use lowercase column names (`id`, `email`, `firstname`, etc.) but your MySQL database had uppercase column names (`USER_ID`, `EMAIL`, `FIRST_NAME`, etc.)

2. **Missing Columns**: Added the `admins` table and ensured all required columns exist in both tables.

3. **Connection Issues**: Added MySQL connection pooling options to prevent "Server has gone away" errors:
   - `pool_pre_ping`: Tests connections before use
   - `pool_recycle`: Recycles connections every 300 seconds
   - `pool_timeout`: Sets connection timeout to 20 seconds
   - `max_overflow`: Limits connection pool overflow

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `firstname`
- `lastname`
- `contact`
- `password_hash`
- `role` (default: 'user')
- `is_active` (default: TRUE)
- `created_at`
- `updated_at`

### Admins Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash`
- `full_name`
- `is_super_admin` (default: FALSE)
- `is_active` (default: TRUE)
- `created_at`
- `last_login`

## Default Admin Account
After running the application for the first time, a default admin account will be created:
- Username: `admin`
- Email: `admin@egrowtify.com`
- Password: `admin123`

## Troubleshooting

If you still get connection errors:

1. **Check XAMPP**: Make sure MySQL is running in XAMPP
2. **Check Port**: Ensure MySQL is running on port 3306
3. **Check Credentials**: Verify the root user has no password
4. **Restart Services**: Restart Apache and MySQL in XAMPP

## Alternative Manual Fix

If you prefer to manually fix the database, you can:

1. Open phpMyAdmin
2. Drop the `egrowtify_db` database
3. Create a new database named `egrowtify_db`
4. Import the updated `egrowtify_db.sql` file 