from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone, timedelta
import secrets
import uuid

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
    is_active = db.Column(db.Boolean, default=False)
    subscribed = db.Column(db.Boolean, default=False)  # Add subscribed property
    email_notifications = db.Column(db.Boolean, default=True)  # Add email_notifications property
    learning_level = db.Column(db.String(20), default='beginner')  # Add learning_level property
    email_verified = db.Column(db.Boolean, default=False)  # Email verification status
    email_verification_token = db.Column(db.String(100), unique=True)  # Verification token
    email_verification_expires = db.Column(db.DateTime)  # Token expiration
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
    
    def generate_email_verification_token(self):
        """Generate a new email verification token"""
        self.email_verification_token = secrets.token_urlsafe(32)
        # Use UTC naive datetime to match MySQL DATETIME (no timezone)
        self.email_verification_expires = datetime.utcnow() + timedelta(hours=24)
        return self.email_verification_token
    
    def is_email_verification_token_valid(self, token):
        """Check if the email verification token is valid"""
        if not (self.email_verification_token and self.email_verification_expires):
            return False
        if self.email_verification_token != token:
            return False
        # Compare as naive UTC datetimes to avoid tz mismatch
        now_utc_naive = datetime.utcnow()
        expires = self.email_verification_expires
        return now_utc_naive < expires
    
    def verify_email(self):
        """Mark email as verified and clear token"""
        self.email_verified = True
        self.email_verification_token = None
        self.email_verification_expires = None

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
    
    def is_admin(self):
        """Admin model users are always admins"""
        return True

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
    image_path = db.Column('IMAGE_PATH', db.String(255))
    created_at = db.Column('CREATED_AT', db.DateTime, default=lambda: datetime.now(timezone.utc))
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
    grid_size = db.Column('GRID_SIZE', db.String(10), default='3x3')
    base_grid_spaces = db.Column('BASE_GRID_SPACES', db.Integer, default=9)
    additional_spaces_purchased = db.Column('ADDITIONAL_SPACES_PURCHASED', db.Integer, default=0)
    used_grid_spaces = db.Column('USED_GRID_SPACES', db.Integer, default=0)
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

class GridSpace(db.Model):
    __tablename__ = 'grid_spaces'
    id = db.Column('SPACE_ID', db.Integer, primary_key=True)
    garden_id = db.Column('GARDEN_ID', db.Integer, db.ForeignKey('garden.GARDEN_ID', ondelete='CASCADE'), nullable=False)
    grid_position = db.Column('GRID_POSITION', db.String(10), nullable=False)  # Format: "row,column" (e.g., "1,1", "2,3")
    plant_id = db.Column('PLANT_ID', db.Integer, db.ForeignKey('plant.PLANT_ID', ondelete='SET NULL'))
    planting_date = db.Column('PLANTING_DATE', db.Date)
    last_watered = db.Column('LAST_WATERED', db.Date)
    last_fertilized = db.Column('LAST_FERTILIZED', db.Date)
    last_pruned = db.Column('LAST_PRUNED', db.Date)
    notes = db.Column('NOTES', db.Text)
    image_path = db.Column('IMAGE_PATH', db.String(255))
    care_suggestions = db.Column('CARE_SUGGESTIONS', db.Text)
    last_updated = db.Column('LAST_UPDATED', db.DateTime, default=lambda: datetime.now(timezone.utc))
    is_active = db.Column('IS_ACTIVE', db.Boolean, default=True)
    created_at = db.Column('CREATED_AT', db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    garden = db.relationship('Garden', backref='grid_spaces')
    plant = db.relationship('Plant', backref='grid_spaces')

class Feedback(db.Model):
    __tablename__ = 'feedback'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, default=5)
    category = db.Column(db.String(50), default='general')
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, resolved, closed
    admin_response = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = db.relationship('User', backref='feedbacks')
    
    def to_dict(self):
        """Convert feedback to dictionary format for API responses"""
        try:
            user_name = 'Unknown User'
            user_email = ''
            if self.user:
                # User model has full_name as a property
                user_name = getattr(self.user, 'full_name', None) or f"{getattr(self.user, 'firstname', '')} {getattr(self.user, 'lastname', '')}".strip() or 'Unknown User'
                user_email = getattr(self.user, 'email', '') or ''
            
            return {
                'id': self.id,
                'user_id': self.user_id,
                'user_name': user_name,
                'user_email': user_email,
                'subject': self.subject or '',
                'message': self.message or '',
                'rating': self.rating or 0,
                'category': self.category or 'general',
                'status': self.status or 'pending',
                'admin_response': self.admin_response,
                'created_at': self.created_at.isoformat() if self.created_at else None
            }
        except Exception as e:
            # Fallback if there's any error in to_dict
            import traceback
            print(f"Error in Feedback.to_dict(): {str(e)}")
            print(traceback.format_exc())
            return {
                'id': self.id,
                'user_id': self.user_id,
                'user_name': 'Unknown User',
                'user_email': '',
                'subject': getattr(self, 'subject', '') or '',
                'message': getattr(self, 'message', '') or '',
                'rating': getattr(self, 'rating', 0) or 0,
                'category': getattr(self, 'category', 'general') or 'general',
                'status': getattr(self, 'status', 'pending') or 'pending',
                'admin_response': getattr(self, 'admin_response', None),
                'created_at': self.created_at.isoformat() if self.created_at else None
            }

class LearningPathContent(db.Model):
    __tablename__ = 'learning_path_content'
    
    id = db.Column(db.Integer, primary_key=True)
    path_difficulty = db.Column(db.String(20), nullable=False)  # 'Beginner', 'Intermediate', 'Expert'
    module_id = db.Column(db.String(50), nullable=False)  # 'plant-basics', 'soil-fundamentals', etc.
    content_type = db.Column(db.String(20), nullable=False)  # 'lesson', 'quiz_question'
    content_id = db.Column(db.Integer)  # lesson ID or question ID
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    media_type = db.Column(db.String(20))  # 'image', 'video'
    media_url = db.Column(db.String(500))
    media_description = db.Column(db.Text)
    question_number = db.Column(db.Integer)  # For quiz questions
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def to_dict(self):
        return {
            'id': self.id,
            'path_difficulty': self.path_difficulty,
            'module_id': self.module_id,
            'content_type': self.content_type,
            'content_id': self.content_id,
            'title': self.title,
            'content': self.content,
            'media_type': self.media_type,
            'media_url': self.media_url,
            'media_description': self.media_description,
            'question_number': self.question_number,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Feedback {self.id}: {self.subject}>'

class SubscriptionPlan(db.Model):
    __tablename__ = 'subscription_plans'
    
    id = db.Column(db.Integer, primary_key=True)
    plan_name = db.Column(db.String(50), unique=True, nullable=False)
    plan_type = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='PHP')
    grid_planner_size = db.Column(db.String(10), nullable=False)
    free_ai_analyses = db.Column(db.Integer, nullable=False)
    free_plant_analyses = db.Column(db.Integer, nullable=False)
    free_soil_analyses = db.Column(db.Integer, nullable=False)
    additional_grid_cost = db.Column(db.Numeric(10, 2), default=20.00)
    additional_ai_cost = db.Column(db.Numeric(10, 2), default=25.00)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user_subscriptions = db.relationship('UserSubscription', backref='subscription_plan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'plan_name': self.plan_name,
            'plan_type': self.plan_type,
            'price': float(self.price),
            'currency': self.currency,
            'grid_planner_size': self.grid_planner_size,
            'free_ai_analyses': self.free_ai_analyses,
            'free_plant_analyses': self.free_plant_analyses,
            'free_soil_analyses': self.free_soil_analyses,
            'additional_grid_cost': float(self.additional_grid_cost),
            'additional_ai_cost': float(self.additional_ai_cost),
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<SubscriptionPlan {self.id}: {self.plan_name}>'

class UserSubscription(db.Model):
    __tablename__ = 'user_subscriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('subscription_plans.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='active')  # active, cancelled, expired
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid, failed
    total_paid = db.Column(db.Numeric(10, 2), default=0.00)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = db.relationship('User', backref='subscriptions')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'plan_id': self.plan_id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'status': self.status,
            'payment_status': self.payment_status,
            'total_paid': float(self.total_paid),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<UserSubscription {self.id}: User {self.user_id} - Plan {self.plan_id}>'

class ActivityLog(db.Model):
    """Track completed plant care actions for reports and analytics"""
    __tablename__ = 'activity_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    garden_id = db.Column(db.Integer, db.ForeignKey('garden.GARDEN_ID'), nullable=True)
    space_id = db.Column(db.Integer, db.ForeignKey('grid_spaces.SPACE_ID'), nullable=True)
    plant_id = db.Column(db.Integer, db.ForeignKey('plant.PLANT_ID'), nullable=True)
    action = db.Column(db.String(20), nullable=False)  # 'water', 'fertilize', 'prune', 'health_change'
    action_date = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = db.relationship('User', backref='activity_logs')
    garden = db.relationship('Garden', backref='activity_logs')
    space = db.relationship('GridSpace', backref='activity_logs')
    plant = db.relationship('Plant', backref='activity_logs')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'garden_id': self.garden_id,
            'space_id': self.space_id,
            'plant_id': self.plant_id,
            'action': self.action,
            'action_date': self.action_date.isoformat(),
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<ActivityLog {self.id}: User {self.user_id} - {self.action} on {self.action_date}>'

class UserPlantUpdateUsage(db.Model):
    """Track how many plant updates a user has consumed or purchased."""
    __tablename__ = 'user_plant_update_usage'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    free_updates_used = db.Column(db.Integer, default=0)
    purchased_credits = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = db.relationship('User', backref=db.backref('plant_update_usage', uselist=False, cascade='all, delete-orphan'))
    
    def total_remaining(self, free_allocation=3):
        free_remaining = max(0, free_allocation - (self.free_updates_used or 0))
        credits = self.purchased_credits or 0
        return free_remaining + credits
    
    def __repr__(self):
        return f'<UserPlantUpdateUsage user={self.user_id} free_used={self.free_updates_used} purchased={self.purchased_credits}>'

class AIUsageTracking(db.Model):
    """Track AI analysis usage (plant and soil) for users."""
    __tablename__ = 'ai_usage_tracking'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    usage_type = db.Column(db.String(20), nullable=False)  # 'plant_analysis' or 'soil_analysis'
    image_path = db.Column(db.String(500), nullable=True)
    analysis_result = db.Column(db.Text, nullable=True)
    cost = db.Column(db.Numeric(10, 2), default=0.00)
    is_free_usage = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = db.relationship('User', backref=db.backref('ai_usage_tracking', lazy='dynamic', cascade='all, delete'))
    
    def __repr__(self):
        return f'<AIUsageTracking {self.id}: User {self.user_id} - {self.usage_type}>'

class Notification(db.Model):
    """Admin announcements and notifications for users"""
    __tablename__ = 'admin_notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), default='Update')  # Update, Maintenance, Feature, System
    priority = db.Column(db.String(20), default='Medium')  # High, Medium, Low
    is_active = db.Column(db.Boolean, default=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    expires_at = db.Column(db.DateTime, nullable=True)  # Optional expiration date
    
    # Relationships
    creator = db.relationship('User', backref='created_notifications', foreign_keys=[created_by])
    
    def to_dict(self):
        """Convert notification to dictionary format for API responses"""
        return {
            'id': self.id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'priority': self.priority,
            'is_active': self.is_active,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None
        }
    
    def __repr__(self):
        return f'<Notification {self.id}: {self.title}>'

class AIAnalysisUsage(db.Model):
    """Track free and purchased AI analysis credits for plant-related analyses (recognition, updates, adding plants)."""
    __tablename__ = 'ai_analysis_usage'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    free_analyses_used = db.Column(db.Integer, default=0)  # Free plant analyses used
    purchased_credits = db.Column(db.Integer, default=0)  # Purchased plant analysis credits
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = db.relationship('User', backref=db.backref('ai_analysis_usage', uselist=False, cascade='all, delete-orphan'))
    
    def total_remaining(self, free_allocation=3):
        """Calculate total remaining plant analyses (free + purchased)"""
        free_remaining = max(0, free_allocation - (self.free_analyses_used or 0))
        credits = self.purchased_credits or 0
        return free_remaining + credits
    
    def can_use_free(self, free_allocation=3):
        """Check if user can use a free plant analysis"""
        return (self.free_analyses_used or 0) < free_allocation
    
    def __repr__(self):
        return f'<AIAnalysisUsage user={self.user_id} free_used={self.free_analyses_used} purchased={self.purchased_credits}>'

class SoilAnalysisUsage(db.Model):
    """Track free and purchased AI analysis credits for soil analysis (separate from plant analysis)."""
    __tablename__ = 'soil_analysis_usage'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    free_analyses_used = db.Column(db.Integer, default=0)  # Free soil analyses used
    purchased_credits = db.Column(db.Integer, default=0)  # Purchased soil analysis credits
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = db.relationship('User', backref=db.backref('soil_analysis_usage', uselist=False, cascade='all, delete-orphan'))
    
    def total_remaining(self, free_allocation=3):
        """Calculate total remaining soil analyses (free + purchased)"""
        free_remaining = max(0, free_allocation - (self.free_analyses_used or 0))
        credits = self.purchased_credits or 0
        return free_remaining + credits
    
    def can_use_free(self, free_allocation=3):
        """Check if user can use a free soil analysis"""
        return (self.free_analyses_used or 0) < free_allocation
    
    def __repr__(self):
        return f'<SoilAnalysisUsage user={self.user_id} free_used={self.free_analyses_used} purchased={self.purchased_credits}>'

class UserSharedConcept(db.Model):
    """User contributed concepts, techniques, and ideas that can be shared across the community."""
    __tablename__ = 'user_shared_concepts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    summary = db.Column(db.String(255), nullable=True)
    technique_steps = db.Column(db.Text, nullable=True)
    tips = db.Column(db.Text, nullable=True)
    tags = db.Column(db.String(200), nullable=True)  # comma separated
    is_public = db.Column(db.Boolean, default=True)
    source = db.Column(db.String(50), default='manual')  # manual, import
    imported_from = db.Column(db.String(150), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = db.relationship('User', backref=db.backref('shared_concepts', lazy='dynamic', cascade='all, delete'))
    
    def to_dict(self, include_owner=False):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'summary': self.summary,
            'technique_steps': self.technique_steps,
            'tips': self.tips,
            'tags': [tag.strip() for tag in (self.tags or '').split(',') if tag.strip()],
            'is_public': self.is_public,
            'source': self.source,
            'imported_from': self.imported_from,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        if include_owner and self.user:
            data['owner'] = {
                'id': self.user.id,
                'name': self.user.full_name if hasattr(self.user, 'full_name') else self.user.email
            }
        return data
    
    def __repr__(self):
        return f'<UserSharedConcept {self.id}: {self.title}>'