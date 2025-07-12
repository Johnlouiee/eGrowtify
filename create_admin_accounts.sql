-- Create default admin accounts for eGrowtify
-- Run this script after setting up your database

USE egrowtify_db;

-- Insert default admin account
-- Password: admin123 (hashed with werkzeug.security.generate_password_hash)
INSERT INTO users (email, firstname, lastname, contact, password_hash, role, is_active, subscribed, email_notifications, learning_level) 
VALUES (
    'admin@egrowtify.com',
    'Admin',
    'User',
    '1234567890',
    'pbkdf2:sha256:600000$YOUR_SALT_HERE$YOUR_HASH_HERE',  -- This will be replaced with actual hash
    'admin',
    1,
    1,
    1,
    'expert'
);

-- Insert a second admin account for testing
INSERT INTO users (email, firstname, lastname, contact, password_hash, role, is_active, subscribed, email_notifications, learning_level) 
VALUES (
    'superadmin@egrowtify.com',
    'Super',
    'Admin',
    '0987654321',
    'pbkdf2:sha256:600000$YOUR_SALT_HERE$YOUR_HASH_HERE',  -- This will be replaced with actual hash
    'admin',
    1,
    1,
    1,
    'expert'
);

-- Verify the admin accounts were created
SELECT id, email, firstname, lastname, role, is_active FROM users WHERE role = 'admin'; 