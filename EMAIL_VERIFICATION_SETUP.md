# Email Verification Setup Guide

This guide will help you set up email verification for your eGrowtify application.

## 🚀 Quick Setup

### 1. Install Required Dependencies

```bash
pip install Flask-Mail==0.9.1
```

### 2. Run Database Migration

```bash
python add_email_verification_fields.py
```

### 3. Configure Email Settings

Create a `.env` file in your project root with the following email configuration:

```env
# Email Configuration (Required for email verification)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USE_SSL=False
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_DEFAULT_SENDER=your_email@gmail.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

### 4. Gmail App Password Setup

For Gmail SMTP, you need to create an App Password:

1. **Enable 2-Factor Authentication** on your Gmail account
2. Go to **Google Account settings** > **Security** > **App passwords**
3. Generate an app password for "Mail"
4. Use that app password as `MAIL_PASSWORD` (not your regular Gmail password)

### 5. Alternative Email Providers

#### Outlook/Hotmail
```env
MAIL_SERVER=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USE_SSL=False
MAIL_USERNAME=your_email@outlook.com
MAIL_PASSWORD=your_password
MAIL_DEFAULT_SENDER=your_email@outlook.com
```

#### Custom SMTP Server
```env
MAIL_SERVER=your_smtp_server.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USE_SSL=False
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_DEFAULT_SENDER=your_email@yourdomain.com
```

## 🔧 Features Added

### Backend Changes
- ✅ Added email verification fields to User model
- ✅ Created email service with HTML templates
- ✅ Updated registration to send verification emails
- ✅ Added email verification endpoint
- ✅ Added resend verification endpoint
- ✅ Updated login to check email verification status

### Frontend Changes
- ✅ Created VerifyEmail page component
- ✅ Updated registration form flow
- ✅ Updated login form with verification error handling
- ✅ Added email verification route

## 📧 Email Verification Flow

1. **User Registration**
   - User fills out registration form
   - Account is created but marked as inactive
   - Verification email is sent automatically
   - User is redirected to verification page

2. **Email Verification**
   - User clicks link in email
   - Token is validated (24-hour expiration)
   - Account is activated
   - User can now log in

3. **Login Process**
   - System checks if email is verified
   - Unverified users see verification prompt
   - Link to resend verification email

## 🛠️ API Endpoints

### POST `/api/verify-email`
Verify user email with token
```json
{
  "token": "verification_token_here"
}
```

### POST `/api/resend-verification`
Resend verification email
```json
{
  "email": "user@example.com"
}
```

## 🧪 Testing

### Test Email Verification
1. Register a new account
2. Check your email for verification link
3. Click the link to verify
4. Try logging in

### Test Resend Functionality
1. Go to `/verify-email` without a token
2. Enter your email address
3. Click "Resend Verification Email"

## 🚨 Troubleshooting

### Email Not Sending
- Check your SMTP credentials
- Verify app password for Gmail
- Check firewall/antivirus settings
- Test with a different email provider

### Database Errors
- Run the migration script: `python add_email_verification_fields.py`
- Check MySQL connection
- Verify database permissions

### Frontend Issues
- Clear browser cache
- Check browser console for errors
- Verify API endpoints are accessible

## 📝 Environment Variables

Make sure these are set in your `.env` file:

```env
# Required for email verification
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_DEFAULT_SENDER=your_email@gmail.com
FRONTEND_URL=http://localhost:3000

# Existing variables
FLASK_SECRET_KEY=your_secret_key_here
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=egrowtifydb
```

## 🔒 Security Notes

- Verification tokens expire after 24 hours
- Tokens are cryptographically secure
- Email verification is required before login
- Failed verification attempts are logged

## 📞 Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set
3. Test email configuration with a simple script
4. Check database migration was successful

---

**Note**: This email verification system is now fully integrated into your eGrowtify application. All new users must verify their email before they can log in and use the platform.
