from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    contact = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'
    is_active = db.Column(db.Boolean, default=True)
    subscribed = db.Column(db.Boolean, default=False)  # Add subscribed property
    email_notifications = db.Column(db.Boolean, default=True)  # Add email_notifications property
    learning_level = db.Column(db.String(20), default='beginner')  # Add learning_level property
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    @property
    def full_name(self):
        return f"{self.firstname} {self.lastname}"

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_admin(self):
        return self.role == 'admin'

    def __repr__(self):
        return f'<User {self.email}>'

class Admin(UserMixin, db.Model):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    is_super_admin = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    last_login = db.Column(db.DateTime)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<Admin {self.username}>'

class Plant(db.Model):
    __tablename__ = 'plant'
    id = db.Column('PLANT_ID', db.Integer, primary_key=True)
    name = db.Column('NAME', db.String(100), nullable=False)
    type = db.Column('TYPE', db.String(20), nullable=False)
    environment = db.Column('ENVIRONMENT', db.String(20), nullable=False)
    care_guide = db.Column('CARE_GUIDE', db.Text, nullable=False)
    ideal_soil_type = db.Column('IDEAL_SOIL_TYPE', db.String(100))
    watering_frequency = db.Column('WATERING_FREQUENCY', db.Integer)
    fertilizing_frequency = db.Column('FERTILIZING_FREQUENCY', db.Integer)
    pruning_frequency = db.Column('PRUNING_FREQUENCY', db.Integer)
    # Relationship to PlantTracking
    plant_trackings = db.relationship('PlantTracking', backref='plant', cascade='all, delete')

class Garden(db.Model):
    __tablename__ = 'garden'
    id = db.Column('GARDEN_ID', db.Integer, primary_key=True)
    user_id = db.Column('USER_ID', db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    name = db.Column('NAME', db.String(100), nullable=False)
    garden_type = db.Column('GARDEN_TYPE', db.String(20), nullable=False)
    location_city = db.Column('LOCATION_CITY', db.String(100))
    location_country = db.Column('LOCATION_COUNTRY', db.String(100))
    created_at = db.Column('CREATED_AT', db.DateTime, default=lambda: datetime.now(timezone.utc))
    # Relationship to PlantTracking
    plant_trackings = db.relationship('PlantTracking', backref='garden', cascade='all, delete')

class PlantTracking(db.Model):
    __tablename__ = 'planttracking'
    id = db.Column('TRACKING_ID', db.Integer, primary_key=True)
    garden_id = db.Column('GARDEN_ID', db.Integer, db.ForeignKey('garden.GARDEN_ID', ondelete='CASCADE'), nullable=False)
    plant_id = db.Column('PLANT_ID', db.Integer, db.ForeignKey('plant.PLANT_ID'), nullable=False)
    planting_date = db.Column('PLANTING_DATE', db.Date, nullable=False)
    last_watered = db.Column('LAST_WATERED', db.Date)
    last_fertilized = db.Column('LAST_FERTILIZED', db.Date)
    last_pruned = db.Column('LAST_PRUNED', db.Date)
    notes = db.Column('NOTES', db.Text)
