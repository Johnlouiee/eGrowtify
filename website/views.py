from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from . import mysql
from .models import db, User, Admin, Garden, Plant, PlantTracking
from datetime import datetime

views = Blueprint('views', __name__)

@views.route('/')
def home():
    from flask_login import current_user
    if current_user.is_authenticated and not isinstance(current_user, Admin):
        return redirect(url_for('views.user_dashboard'))
    return render_template("home.html")

@views.route('/test_db')
def test_db():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT DATABASE()")
        data = cur.fetchone()
        cur.close()
        return f"Connected to database: {data[0]}"
    except Exception as e:
        return f"Database connection error: {str(e)}"

@views.route('/user/dashboard')
@login_required
def user_dashboard():
    if isinstance(current_user, Admin):
        flash('Admins should use the admin dashboard.', category='info')
        return redirect(url_for('views.admin_dashboard'))
    
    return render_template("user_dashboard.html")

@views.route('/admin/dashboard')
@login_required
def admin_dashboard():
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.user_dashboard'))
    
    # Get some basic stats
    total_users = User.query.count()
    active_users = User.query.filter_by(is_active=True).count()
    total_admins = Admin.query.count()
    
    return render_template("admin_dashboard.html", 
                         total_users=total_users,
                         active_users=active_users,
                         total_admins=total_admins)

@views.route('/admin/stats')
@login_required
def admin_stats():
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.home'))
    
    # Get detailed statistics
    users = User.query.all()
    admins = Admin.query.all()
    
    return render_template("admin_stats.html", users=users, admins=admins)

@views.route('/camera')
@login_required
def camera():
    from flask_login import current_user
    if current_user.is_admin():
        flash('Admins do not have access to the camera feature.', category='info')
        return redirect(url_for('views.admin_dashboard'))
    return render_template('camera.html')

@views.route('/learning-paths')
def learning_paths():
    return render_template('learning_paths.html')

@views.route('/track-plants')
def track_plants():
    return render_template('track_plants.html')

@views.route('/gardening-tips')
def gardening_tips():
    return render_template('gardening_tips.html')

@views.route('/notifications')
def notifications():
    return render_template('notifications.html')

@views.route('/garden', methods=['GET'])
@login_required
def garden():
    # List gardens and plants for the current user
    gardens = Garden.query.filter_by(user_id=current_user.id).all()
    # For each garden, get plants via PlantTracking
    plant_trackings = PlantTracking.query.join(Garden).filter(Garden.user_id == current_user.id).all()
    plants = []
    for pt in plant_trackings:
        plant = Plant.query.get(pt.plant_id)
        if plant:
            plants.append({
                'tracking': pt,
                'plant': plant,
                'garden': pt.garden
            })
    return render_template('garden.html', gardens=gardens, plants=plants)

@views.route('/garden/add', methods=['POST'])
@login_required
def add_garden():
    name = request.form.get('name')
    garden_type = request.form.get('garden_type')
    location_city = request.form.get('location_city')
    location_country = request.form.get('location_country')
    if not name or not garden_type:
        flash('Name and type are required.', 'error')
        return redirect(url_for('views.garden'))
    garden = Garden(user_id=current_user.id, name=name, garden_type=garden_type, location_city=location_city, location_country=location_country)
    db.session.add(garden)
    db.session.commit()
    flash('Garden added!', 'success')
    return redirect(url_for('views.garden'))

@views.route('/garden/edit/<int:garden_id>', methods=['POST'])
@login_required
def edit_garden(garden_id):
    garden = Garden.query.get_or_404(garden_id)
    if garden.user_id != current_user.id:
        flash('Unauthorized.', 'error')
        return redirect(url_for('views.garden'))
    garden.name = request.form.get('name')
    garden.garden_type = request.form.get('garden_type')
    garden.location_city = request.form.get('location_city')
    garden.location_country = request.form.get('location_country')
    db.session.commit()
    flash('Garden updated!', 'success')
    return redirect(url_for('views.garden'))

@views.route('/garden/delete/<int:garden_id>', methods=['POST'])
@login_required
def delete_garden(garden_id):
    garden = Garden.query.get_or_404(garden_id)
    if garden.user_id != current_user.id:
        flash('Unauthorized.', 'error')
        return redirect(url_for('views.garden'))
    db.session.delete(garden)
    db.session.commit()
    flash('Garden deleted!', 'success')
    return redirect(url_for('views.garden'))

@views.route('/plant/add', methods=['POST'])
@login_required
def add_plant():
    name = request.form.get('name')
    type_ = request.form.get('type')
    environment = request.form.get('environment')
    care_guide = request.form.get('care_guide')
    ideal_soil_type = request.form.get('ideal_soil_type')
    watering_frequency = request.form.get('watering_frequency')
    fertilizing_frequency = request.form.get('fertilizing_frequency')
    pruning_frequency = request.form.get('pruning_frequency')
    garden_id = request.form.get('garden_id')
    planting_date = request.form.get('planting_date')
    if not name or not type_ or not environment or not care_guide or not garden_id or not planting_date:
        flash('Missing required fields.', 'error')
        return redirect(url_for('views.garden'))
    plant = Plant(name=name, type=type_, environment=environment, care_guide=care_guide, ideal_soil_type=ideal_soil_type, watering_frequency=watering_frequency, fertilizing_frequency=fertilizing_frequency, pruning_frequency=pruning_frequency)
    db.session.add(plant)
    db.session.commit()
    tracking = PlantTracking(garden_id=garden_id, plant_id=plant.id, planting_date=planting_date)
    db.session.add(tracking)
    db.session.commit()
    flash('Plant added!', 'success')
    return redirect(url_for('views.garden'))

@views.route('/plant/edit/<int:tracking_id>', methods=['POST'])
@login_required
def edit_plant(tracking_id):
    tracking = PlantTracking.query.get_or_404(tracking_id)
    garden = Garden.query.get(tracking.garden_id)
    if garden.user_id != current_user.id:
        flash('Unauthorized.', 'error')
        return redirect(url_for('views.garden'))
    plant = Plant.query.get(tracking.plant_id)
    plant.name = request.form.get('name')
    plant.type = request.form.get('type')
    plant.environment = request.form.get('environment')
    plant.care_guide = request.form.get('care_guide')
    plant.ideal_soil_type = request.form.get('ideal_soil_type')
    plant.watering_frequency = request.form.get('watering_frequency')
    plant.fertilizing_frequency = request.form.get('fertilizing_frequency')
    plant.pruning_frequency = request.form.get('pruning_frequency')
    tracking.planting_date = request.form.get('planting_date')
    db.session.commit()
    flash('Plant updated!', 'success')
    return redirect(url_for('views.garden'))

@views.route('/plant/delete/<int:tracking_id>', methods=['POST'])
@login_required
def delete_plant(tracking_id):
    tracking = PlantTracking.query.get_or_404(tracking_id)
    garden = Garden.query.get(tracking.garden_id)
    if garden.user_id != current_user.id:
        flash('Unauthorized.', 'error')
        return redirect(url_for('views.garden'))
    plant = Plant.query.get(tracking.plant_id)
    db.session.delete(tracking)
    db.session.delete(plant)
    db.session.commit()
    flash('Plant deleted!', 'success')
    return redirect(url_for('views.garden'))

@views.route('/smart-alerts')
def smart_alerts():
    return render_template('smart_alerts.html')

@views.route('/features')
@login_required
def features():
    return render_template('features.html')

@views.route('/about')
def about():
    return render_template('about.html')

@views.route('/admin/reports')
@login_required
def admin_reports():
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.user_dashboard'))
    
    # Get statistics for reports
    total_users = User.query.count()
    active_users = User.query.filter_by(is_active=True).count()
    subscribed_users = User.query.filter_by(subscribed=True).count()
    total_admins = Admin.query.count()
    
    # Get recent user registrations
    recent_users = User.query.order_by(User.created_at.desc()).limit(10).all()
    
    # Get user activity data (placeholder for now)
    user_activity = {
        'daily': 45,
        'weekly': 320,
        'monthly': 1200
    }
    
    return render_template("admin_reports.html", 
                         total_users=total_users,
                         active_users=active_users,
                         subscribed_users=subscribed_users,
                         total_admins=total_admins,
                         recent_users=recent_users,
                         user_activity=user_activity)

@views.route('/admin/feedback')
@login_required
def admin_feedback():
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.user_dashboard'))
    
    # Get feedback data (placeholder for now)
    feedback_list = [
        {
            'id': 1,
            'user_email': 'john.doe@example.com',
            'subject': 'Bug Report',
            'message': 'The camera feature is not working properly on mobile devices.',
            'status': 'pending',
            'created_at': datetime.now()
        },
        {
            'id': 2,
            'user_email': 'jane.smith@example.com',
            'subject': 'Feature Request',
            'message': 'Would love to have more plant varieties in the database.',
            'status': 'reviewed',
            'created_at': datetime.now()
        },
        {
            'id': 3,
            'user_email': 'mike.wilson@example.com',
            'subject': 'General Inquiry',
            'message': 'How do I reset my password?',
            'status': 'resolved',
            'created_at': datetime.now()
        }
    ]
    
    return render_template("admin_feedback.html", feedback_list=feedback_list)

@views.route('/admin/feedback/<int:feedback_id>/update', methods=['POST'])
@login_required
def update_feedback_status(feedback_id):
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.admin_feedback'))
    
    status = request.form.get('status')
    # Here you would update the feedback status in the database
    # For now, just flash a message
    flash(f'Feedback status updated to {status}.', category='success')
    return redirect(url_for('views.admin_feedback'))

@views.route('/admin/system-content')
@login_required
def admin_system_content():
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.user_dashboard'))
    
    # Placeholder data for system content management
    ai_data = {
        'plant_recognition_model': 'v2.1',
        'last_updated': '2024-01-15',
        'accuracy': '94.5%',
        'total_plants': 1500
    }
    
    learning_paths = [
        {'id': 1, 'name': 'Beginner Gardening', 'status': 'active', 'users': 45},
        {'id': 2, 'name': 'Intermediate Techniques', 'status': 'active', 'users': 23},
        {'id': 3, 'name': 'Advanced Horticulture', 'status': 'draft', 'users': 0}
    ]
    
    seasonal_content = [
        {'season': 'Spring', 'status': 'published', 'last_updated': '2024-03-01'},
        {'season': 'Summer', 'status': 'published', 'last_updated': '2024-06-01'},
        {'season': 'Fall', 'status': 'draft', 'last_updated': '2024-09-01'},
        {'season': 'Winter', 'status': 'draft', 'last_updated': '2024-12-01'}
    ]
    
    notification_templates = [
        {'id': 1, 'name': 'Watering Reminder', 'status': 'active'},
        {'id': 2, 'name': 'Fertilizing Schedule', 'status': 'active'},
        {'id': 3, 'name': 'Seasonal Tips', 'status': 'active'},
        {'id': 4, 'name': 'New Feature Alert', 'status': 'draft'}
    ]
    
    return render_template("admin_system_content.html", 
                         ai_data=ai_data,
                         learning_paths=learning_paths,
                         seasonal_content=seasonal_content,
                         notification_templates=notification_templates)

@views.route('/admin/ai-data', methods=['GET', 'POST'])
@login_required
def admin_ai_data():
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.user_dashboard'))
    
    if request.method == 'POST':
        # Handle AI data updates
        flash('AI data updated successfully!', category='success')
        return redirect(url_for('views.admin_ai_data'))
    
    return render_template("admin_ai_data.html")

@views.route('/admin/learning-paths', methods=['GET', 'POST'])
@login_required
def admin_learning_paths():
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.user_dashboard'))
    
    if request.method == 'POST':
        # Handle learning path updates
        flash('Learning paths updated successfully!', category='success')
        return redirect(url_for('views.admin_learning_paths'))
    
    return render_template("admin_learning_paths.html")

@views.route('/admin/notifications', methods=['GET', 'POST'])
@login_required
def admin_notifications():
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.user_dashboard'))
    
    if request.method == 'POST':
        # Handle notification template updates
        flash('Notification templates updated successfully!', category='success')
        return redirect(url_for('views.admin_notifications'))
    
    return render_template("admin_notifications.html")

@views.route('/admin/seasonal-planning', methods=['GET', 'POST'])
@login_required
def admin_seasonal_planning():
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.user_dashboard'))
    
    if request.method == 'POST':
        # Handle seasonal content updates
        flash('Seasonal content updated successfully!', category='success')
        return redirect(url_for('views.admin_seasonal_planning'))
    
    return render_template("admin_seasonal_planning.html")

@views.route('/admin/rollback-content', methods=['GET', 'POST'])
@login_required
def admin_rollback_content():
    if not current_user.is_admin():
        flash('Access denied. Admin privileges required.', category='error')
        return redirect(url_for('views.user_dashboard'))
    
    if request.method == 'POST':
        # Handle content rollback
        flash('Content rollback completed successfully!', category='success')
        return redirect(url_for('views.admin_rollback_content'))
    
    return render_template("admin_rollback_content.html")
