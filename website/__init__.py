from flask import Flask
from flask_mysqldb import MySQL
from flask_login import LoginManager
from .models import db, User, Admin

mysql = MySQL()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'OPAW'

    # MySQL Configuration for XAMPP
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = ''  
    app.config['MYSQL_DB'] = 'egrowtify_db'

    # SQLAlchemy Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/egrowtify_db?charset=utf8mb4'
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
        db.create_all()
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

    return app
