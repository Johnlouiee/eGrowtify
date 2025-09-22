from flask import current_app, render_template_string
from flask_mail import Mail, Message
import os

mail = Mail()

def init_mail(app):
    """Initialize Flask-Mail with the app"""
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
    app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'False').lower() == 'true'
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    # Do NOT force a default sender; allow dynamic per-message sender
    # Prefer an explicit override if provided
    override_sender = os.getenv('MAIL_SENDER_OVERRIDE')
    if override_sender:
        app.config['MAIL_DEFAULT_SENDER'] = override_sender
    elif os.getenv('MAIL_DEFAULT_SENDER'):
        app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
    
    mail.init_app(app)

def _resolve_sender(sender_email: str | None) -> str | None:
    """Resolve sender email for a message.

    Priority:
    1) Explicit sender_email argument
    2) MAIL_DEFAULT_SENDER env (if set)
    3) MAIL_USERNAME env (common for SMTP auth)
    If none available, raise a descriptive error.
    """
    if sender_email and sender_email.strip():
        return sender_email.strip()
    # Check app config first (set during init)
    try:
        from flask import current_app as _app
        cfg_default = _app.config.get('MAIL_DEFAULT_SENDER')
        if cfg_default:
            return cfg_default
        cfg_username = _app.config.get('MAIL_USERNAME')
        if cfg_username:
            return cfg_username
    except Exception:
        pass

    env_default = os.getenv('MAIL_DEFAULT_SENDER')
    if env_default:
        return env_default
    username = os.getenv('MAIL_USERNAME')
    if username:
        return username
    # Return None to allow caller to gracefully skip sending in dev
    return None

def send_email_verification(user_email, user_name, verification_token, sender_email: str | None = None):
    """Send email verification email to user with a dynamic sender."""
    try:
        # Create verification URL
        base_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        verification_url = f"{base_url}/verify-email?token={verification_token}"
        
        # Email template
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Verify Your Email - eGrowtify</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌱 Welcome to eGrowtify!</h1>
                </div>
                <div class="content">
                    <h2>Hi {{ user_name }},</h2>
                    <p>Thank you for joining eGrowtify! We're excited to help you start your smart gardening journey.</p>
                    <p>To complete your registration and start using all features, please verify your email address by clicking the button below:</p>
                    
                    <div style="text-align: center;">
                        <a href="{{ verification_url }}" class="button">Verify Email Address</a>
                    </div>
                    
                    <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background-color: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">{{ verification_url }}</p>
                    
                    <p><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
                    
                    <p>If you didn't create an account with eGrowtify, please ignore this email.</p>
                    
                    <p>Happy gardening!<br>
                    The eGrowtify Team</p>
                </div>
                <div class="footer">
                    <p>© 2024 eGrowtify. All rights reserved.</p>
                    <p>This email was sent to {{ user_email }}</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create message with dynamic sender
        resolved_sender = _resolve_sender(sender_email)
        if not resolved_sender:
            if os.getenv('SUPPRESS_EMAIL_ERRORS', 'true').lower() == 'true':
                current_app.logger.info('Skipping verification email send: no sender configured (dev mode).')
                return False
            raise RuntimeError('No sender configured. Pass sender_email or set MAIL_DEFAULT_SENDER/MAIL_USERNAME.')

        msg = Message(
            subject='Verify Your Email - eGrowtify',
            recipients=[user_email],
            sender=resolved_sender,
            html=render_template_string(html_template, 
                                      user_name=user_name, 
                                      verification_url=verification_url,
                                      user_email=user_email)
        )
        
        # Send email
        mail.send(msg)
        return True
        
    except Exception as e:
        current_app.logger.error(f"Failed to send verification email: {str(e)}")
        return False

def send_password_reset_email(user_email, user_name, reset_token, sender_email: str | None = None):
    """Send password reset email to user with a dynamic sender."""
    try:
        # Create reset URL
        base_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        reset_url = f"{base_url}/reset-password?token={reset_token}"
        
        # Email template
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Reset Your Password - eGrowtify</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔒 Password Reset Request</h1>
                </div>
                <div class="content">
                    <h2>Hi {{ user_name }},</h2>
                    <p>We received a request to reset your password for your eGrowtify account.</p>
                    <p>Click the button below to reset your password:</p>
                    
                    <div style="text-align: center;">
                        <a href="{{ reset_url }}" class="button">Reset Password</a>
                    </div>
                    
                    <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background-color: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">{{ reset_url }}</p>
                    
                    <p><strong>Important:</strong> This reset link will expire in 1 hour for security reasons.</p>
                    
                    <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
                    
                    <p>Best regards,<br>
                    The eGrowtify Team</p>
                </div>
                <div class="footer">
                    <p>© 2024 eGrowtify. All rights reserved.</p>
                    <p>This email was sent to {{ user_email }}</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create message with dynamic sender
        resolved_sender = _resolve_sender(sender_email)
        if not resolved_sender:
            if os.getenv('SUPPRESS_EMAIL_ERRORS', 'true').lower() == 'true':
                current_app.logger.info('Skipping password reset email send: no sender configured (dev mode).')
                return False
            raise RuntimeError('No sender configured. Pass sender_email or set MAIL_DEFAULT_SENDER/MAIL_USERNAME.')

        msg = Message(
            subject='Reset Your Password - eGrowtify',
            recipients=[user_email],
            sender=resolved_sender,
            html=render_template_string(html_template, 
                                      user_name=user_name, 
                                      reset_url=reset_url,
                                      user_email=user_email)
        )
        
        # Send email
        mail.send(msg)
        return True
        
    except Exception as e:
        current_app.logger.error(f"Failed to send password reset email: {str(e)}")
        return False
