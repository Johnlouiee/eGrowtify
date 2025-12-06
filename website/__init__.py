from flask import Flask
from flask_mysqldb import MySQL
from flask_login import LoginManager
from flask_cors import CORS
from .models import db, User, Admin
from .email_service import init_mail
from dotenv import load_dotenv, find_dotenv
import os

mysql = MySQL()
login_manager = LoginManager()

def create_app():
    # Load .env reliably from project root
    load_dotenv(find_dotenv(), override=True)
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'OPAW')

    # Enable CORS for React frontend - supports multiple origins via comma-separated list
    cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
    CORS(app, origins=cors_origins, supports_credentials=True)

    # MySQL Configuration - use environment variables for production
    app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
    app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
    app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', '')
    app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'egrowtifydb')

    # SQLAlchemy Configuration - construct URI from environment variables
    mysql_user = os.getenv('MYSQL_USER', 'root')
    mysql_password = os.getenv('MYSQL_PASSWORD', '')
    mysql_host = os.getenv('MYSQL_HOST', 'localhost')
    mysql_db = os.getenv('MYSQL_DB', 'egrowtifydb')
    
    # Support both MySQL and PostgreSQL (for platforms like Render/Railway)
    db_type = os.getenv('DATABASE_TYPE', 'mysql')
    if db_type == 'postgresql':
        database_url = os.getenv('DATABASE_URL')
        if database_url:
            # Handle both postgres:// and postgresql:// URLs
            if database_url.startswith('postgres://'):
                database_url = database_url.replace('postgres://', 'postgresql://', 1)
            app.config['SQLALCHEMY_DATABASE_URI'] = database_url
            print(f"✅ Using PostgreSQL database from DATABASE_URL")
        else:
            # Fallback to constructing from individual variables
            app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{mysql_user}:{mysql_password}@{mysql_host}/{mysql_db}"
            print(f"⚠️ DATABASE_URL not set, using individual PostgreSQL variables")
    else:
        password_part = f":{mysql_password}" if mysql_password else ""
        app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{mysql_user}{password_part}@{mysql_host}/{mysql_db}?charset=utf8mb4'
        print(f"✅ Using MySQL database: {mysql_host}/{mysql_db}")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_timeout': 20,
        'max_overflow': 0
    }

    # Initialize extensions
    # Only initialize MySQL extension if using MySQL (not PostgreSQL)
    if db_type != 'postgresql':
        mysql.init_app(app)
    
    # Initialize SQLAlchemy (works with both MySQL and PostgreSQL)
    try:
        db.init_app(app)
        print("✅ SQLAlchemy initialized successfully")
    except Exception as db_init_error:
        print(f"❌ SQLAlchemy initialization error: {db_init_error}")
        # Don't fail completely - let it try to connect later
        raise
    
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    init_mail(app)

    @login_manager.unauthorized_handler
    def handle_unauthorized():
        # Ensure API routes get JSON 401 instead of redirect/HTML
        return ({"success": False, "message": "Authentication required"}, 401)

    @login_manager.user_loader
    def load_user(user_id):
        # Try to load as User first, then as Admin
        user = User.query.get(int(user_id))
        if user:
            return user
        return Admin.query.get(int(user_id))

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    # Create database tables (only if not in production or if explicitly enabled)
    # In production, tables should be created via migrations or manual setup
    with app.app_context():
        try:
            # Test database connection first
            try:
                conn = db.engine.connect()
                conn.close()
                print("✅ Database connection successful")
            except Exception as conn_error:
                print(f"❌ Database connection test failed: {conn_error}")
                print(f"   Database URI: {app.config.get('SQLALCHEMY_DATABASE_URI', 'Not set')[:50]}...")
                # Don't fail completely - let it try again on first request
                raise
            
            # Only create tables if they don't exist (safer for production)
            try:
                db.create_all()
                print("✅ Database tables created/verified successfully")
                
                # Create a default admin user if none exists
                try:
                    if not Admin.query.filter_by(username='admin').first():
                        admin = Admin(
                            username='admin',
                            email='admin@egrowtify.com',
                            full_name='System Administrator',
                            is_super_admin=True
                        )
                        admin.set_password('admin123')
                        db.session.add(admin)
                        db.session.commit()
                        print("✅ Default admin user created")
                except Exception as admin_error:
                    print(f"⚠️ Admin user creation skipped: {admin_error}")
            except Exception as table_error:
                print(f"⚠️ Table creation error: {table_error}")
                # This might be okay if tables already exist
        except Exception as e:
            print(f"❌ Database initialization error: {e}")
            print(f"   Error type: {type(e).__name__}")
            import traceback
            print(f"   Full traceback:")
            traceback.print_exc()
            print("⚠️ Application will continue but database operations may fail")
            # Don't fail the app startup - let it continue and show error on first request

    return app
