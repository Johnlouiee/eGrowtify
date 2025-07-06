# eGrowtify - Account Management System

A comprehensive Flask-based web application with MySQL integration and role-based authentication system for users and administrators.

## Features

### 🔐 Authentication & Authorization
- **User Registration**: Create new user accounts with validation
- **Admin Registration**: Super admins can create new admin accounts
- **Role-based Access**: Separate dashboards for users and administrators
- **Session Management**: Secure login/logout with Flask-Login
- **Password Security**: Hashed passwords using Werkzeug

### 👥 User Management
- **User Dashboard**: Personalized dashboard for regular users
- **Profile Management**: View and manage user profiles
- **Account Status**: Active/inactive account management
- **Contact Information**: Store and manage user contact details

### 🛡️ Admin Features
- **Admin Dashboard**: Comprehensive admin interface with statistics
- **User Management**: View, activate, and deactivate user accounts
- **Super Admin**: Create new admin accounts (super admin only)
- **System Statistics**: Monitor user growth and activity
- **Database Management**: Direct MySQL integration

### 🎨 Modern UI
- **Bootstrap 5**: Responsive and modern design
- **Font Awesome**: Professional icons throughout the interface
- **Flash Messages**: User-friendly notifications
- **Mobile Responsive**: Works on all device sizes

## Prerequisites

- **XAMPP**: For MySQL database server
- **Python 3.7+**: For running the Flask application
- **pip**: Python package manager

## Installation & Setup

### 1. Database Setup (XAMPP)

1. **Start XAMPP**:
   - Open XAMPP Control Panel
   - Start Apache and MySQL services

2. **Create Database**:
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named `egrowtify_db`
   - Character set: `utf8mb4_unicode_ci`

### 2. Application Setup

1. **Clone/Download the project**:
   ```bash
   cd /path/to/eGrowtify
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python main.py
   ```

4. **Access the application**:
   - Open your browser and go to `http://localhost:5000`

## Default Admin Account

The system automatically creates a default admin account:
- **Username**: `admin`
- **Email**: `admin@egrowtify.com`
- **Password**: `admin123`
- **Role**: Super Admin

⚠️ **Important**: Change the default password after first login!

## Usage

### For Users
1. **Register**: Create a new account at `/register`
2. **Login**: Access your dashboard at `/login`
3. **Dashboard**: View your profile and account information
4. **Profile**: Manage your account settings

### For Administrators
1. **Login**: Use admin credentials at `/login` (select "Administrator")
2. **Dashboard**: Access admin features and statistics
3. **User Management**: View and manage all user accounts
4. **Create Admins**: Super admins can create new admin accounts

## Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email address
- `firstname`: User's first name
- `lastname`: User's last name
- `contact`: Contact number
- `password_hash`: Hashed password
- `role`: User role (user/admin)
- `is_active`: Account status
- `created_at`: Account creation date
- `updated_at`: Last update date

### Admins Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `password_hash`: Hashed password
- `full_name`: Admin's full name
- `is_super_admin`: Super admin privileges
- `is_active`: Account status
- `created_at`: Account creation date
- `last_login`: Last login timestamp

## Security Features

- **Password Hashing**: All passwords are securely hashed
- **Session Management**: Secure user sessions
- **Role-based Access**: Protected routes based on user roles
- **Input Validation**: Form validation and sanitization
- **SQL Injection Protection**: Using SQLAlchemy ORM

## File Structure

```
eGrowtify/
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── README.md              # This file
└── website/
    ├── __init__.py        # Flask app factory
    ├── models.py          # Database models
    ├── auth.py            # Authentication routes
    ├── views.py           # Main application routes
    └── templates/         # HTML templates
        ├── base.html      # Base template
        ├── home.html      # Home page
        ├── login.html     # Login form
        ├── register.html  # Registration form
        ├── user_dashboard.html    # User dashboard
        ├── admin_dashboard.html   # Admin dashboard
        ├── admin_users.html       # User management
        ├── admin_register.html    # Admin creation
        └── profile.html          # User profile
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure XAMPP MySQL is running
   - Check database name is `egrowtify_db`
   - Verify MySQL credentials in `website/__init__.py`

2. **Import Errors**:
   - Install all requirements: `pip install -r requirements.txt`
   - Check Python version (3.7+ required)

3. **Port Already in Use**:
   - Change port in `main.py`: `app.run(debug=True, port=5001)`

### Error Messages

- **"Access denied"**: Insufficient permissions for the action
- **"Invalid credentials"**: Wrong email/password combination
- **"Email already exists"**: Email is already registered

## Development

### Adding New Features

1. **New Routes**: Add to `auth.py` or `views.py`
2. **Database Models**: Add to `models.py`
3. **Templates**: Create new HTML files in `templates/`
4. **Styling**: Use Bootstrap classes for consistency

### Database Migrations

The application uses Flask-SQLAlchemy with automatic table creation. Tables are created automatically when the app starts.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Verify XAMPP and database setup
3. Check console logs for error messages

---

**eGrowtify** - Growing together, managing efficiently.