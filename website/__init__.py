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

    # Enable CORS for React frontend
    CORS(app, origins=['http://localhost:3000'], supports_credentials=True)

    # MySQL Configuration for XAMPP
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = ''  
    app.config['MYSQL_DB'] = 'egrowtifydb'

    # SQLAlchemy Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/egrowtifydb?charset=utf8mb4'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_timeout': 20,
        'max_overflow': 0
    }

    # Initialize extensions
    mysql.init_app(app)
    db.init_app(app)
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

    # Create database tables
    with app.app_context():
        try:
            db.create_all()
            print("✅ Database tables created successfully")
            
            # Create a default admin user if none exists
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
        except Exception as e:
            print(f"❌ Database initialization error: {e}")
            print("💡 Make sure XAMPP MySQL is running and the 'egrowtifydb' database exists")

    return app
