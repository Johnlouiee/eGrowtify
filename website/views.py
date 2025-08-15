from flask import Blueprint, jsonify, request, flash, redirect, url_for
from flask_login import login_required, current_user
from . import mysql
from .models import db, User, Admin, Garden, Plant, PlantTracking
from datetime import datetime, timedelta

views = Blueprint('views', __name__)

@views.route('/')
def home():
    from flask_login import current_user
    if current_user.is_authenticated and not isinstance(current_user, Admin):
        return redirect(url_for('views.user_dashboard'))
    return jsonify({"message": "Welcome to eGrowtify API"})

@views.route('/test_db')
def test_db():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT DATABASE()")
        data = cur.fetchone()
        cur.close()
        return jsonify({"database": data[0], "status": "connected"})
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"})

@views.route('/user/dashboard')
@login_required
def user_dashboard():
    if isinstance(current_user, Admin):
        return jsonify({"error": "Admins should use the admin dashboard."}), 403
    
    return jsonify({"message": "User dashboard", "user_id": current_user.id})

@views.route('/admin/dashboard')
@login_required
def admin_dashboard():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    # Get some basic stats
    total_users = User.query.count()
    active_users = User.query.filter_by(is_active=True).count()
    total_admins = Admin.query.count()
    
    return jsonify({
        "message": "Admin dashboard",
        "stats": {
            "total_users": total_users,
            "active_users": active_users,
            "total_admins": total_admins
        }
    })

@views.route('/admin/stats')
@login_required
def admin_stats():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    # Get detailed statistics
    users = User.query.all()
    admins = Admin.query.all()
    
    return jsonify({
        "users": [{"id": u.id, "email": u.email, "full_name": u.full_name, "is_active": u.is_active} for u in users],
        "admins": [{"id": a.id, "username": a.username, "email": a.email, "full_name": a.full_name} for a in admins]
    })

@views.route('/ai-recognition', methods=['POST'])
@login_required
def ai_plant_recognition():
    if current_user.is_admin():
        return jsonify({"error": "Admins do not have access to the AI recognition feature."}), 403
    
    # This would integrate with actual AI service
    # For now, return mock data
    mock_result = {
        'plant_name': 'Tomato Plant',
        'confidence': 94.5,
        'health_status': 'Healthy',
        'care_recommendations': {
            'watering': 'Water every 2-3 days, keeping soil moist but not soggy',
            'sunlight': 'Full sun (6-8 hours daily)',
            'temperature': '65-85°F (18-29°C)',
            'soil': 'Well-draining, rich soil with pH 6.0-6.8',
            'fertilizing': 'Fertilize every 2-3 weeks with balanced fertilizer'
        },
        'common_issues': [
            'Blossom end rot - caused by calcium deficiency',
            'Early blight - fungal disease, remove affected leaves',
            'Aphids - wash with soapy water or use neem oil'
        ],
        'growth_stage': 'Flowering',
        'estimated_yield': '10-15 tomatoes per plant'
    }
    
    return jsonify(mock_result)

@views.route('/camera')
@login_required
def camera():
    from flask_login import current_user
    if current_user.is_admin():
        return jsonify({"error": "Admins do not have access to the camera feature."}), 403
    return jsonify({"message": "Camera feature", "user_id": current_user.id})

@views.route('/seasonal-planning')
@login_required
def seasonal_planning():
    # Get user's location from their garden data
    user_gardens = Garden.query.filter_by(user_id=current_user.id).all()
    location = "Unknown"
    if user_gardens:
        # Use the first garden's location as user's location
        garden = user_gardens[0]
        location = f"{garden.location_city}, {garden.location_country}" if garden.location_city else "Unknown"
    
    # Get current season
    month = datetime.now().month
    if month >= 3 and month <= 5:
        season = 'spring'
    elif month >= 6 and month <= 8:
        season = 'summer'
    elif month >= 9 and month <= 11:
        season = 'fall'
    else:
        season = 'winter'
    
    # Mock seasonal data - replace with actual seasonal database
    seasonal_data = {
        'location': location,
        'current_season': season,
        'planting_calendar': {
            'spring': ['Tomatoes', 'Peppers', 'Lettuce', 'Herbs'],
            'summer': ['Cucumbers', 'Zucchini', 'Beans', 'Corn'],
            'fall': ['Kale', 'Spinach', 'Garlic', 'Onions'],
            'winter': ['Indoor herbs', 'Microgreens', 'Sprouts']
        },
        'tips': {
            'spring': ['Test soil pH', 'Start seeds indoors', 'Prepare garden beds'],
            'summer': ['Mulch to retain moisture', 'Water deeply', 'Monitor for pests'],
            'fall': ['Plant cool-season crops', 'Clean up garden', 'Add compost'],
            'winter': ['Plan next year', 'Maintain tools', 'Grow indoors']
        }
    }
    
    return jsonify(seasonal_data)

@views.route('/learning-paths')
def learning_paths():
    return jsonify({"message": "Learning paths feature"})

@views.route('/track-plants')
def track_plants():
    return jsonify({"message": "Plant tracking feature"})

@views.route('/gardening-tips')
def gardening_tips():
    return jsonify({"message": "Gardening tips feature"})

@views.route('/notifications')
def notifications():
    return jsonify({"message": "Notifications feature"})

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
                'tracking': {
                    'id': pt.id,
                    'planting_date': pt.planting_date.isoformat() if pt.planting_date else None
                },
                'plant': {
                    'id': plant.id,
                    'name': plant.name,
                    'type': plant.type,
                    'environment': plant.environment,
                    'care_guide': plant.care_guide,
                    'ideal_soil_type': plant.ideal_soil_type,
                    'watering_frequency': plant.watering_frequency,
                    'fertilizing_frequency': plant.fertilizing_frequency,
                    'pruning_frequency': plant.pruning_frequency
                },
                'garden': {
                    'id': pt.garden.id,
                    'name': pt.garden.name,
                    'garden_type': pt.garden.garden_type,
                    'location_city': pt.garden.location_city,
                    'location_country': pt.garden.location_country
                }
            })
    
    return jsonify({
        "gardens": [{
            'id': g.id,
            'name': g.name,
            'garden_type': g.garden_type,
            'location_city': g.location_city,
            'location_country': g.location_country
        } for g in gardens],
        "plants": plants
    })

@views.route('/garden/add', methods=['POST'])
@login_required
def add_garden():
    data = request.get_json()
    name = data.get('name')
    garden_type = data.get('garden_type')
    location_city = data.get('location_city')
    location_country = data.get('location_country')
    
    if not name or not garden_type:
        return jsonify({"error": "Name and type are required."}), 400
    
    garden = Garden(
        user_id=current_user.id, 
        name=name, 
        garden_type=garden_type, 
        location_city=location_city, 
        location_country=location_country
    )
    db.session.add(garden)
    db.session.commit()
    
    return jsonify({"message": "Garden added successfully!", "garden_id": garden.id})

@views.route('/garden/edit/<int:garden_id>', methods=['POST'])
@login_required
def edit_garden(garden_id):
    garden = Garden.query.get_or_404(garden_id)
    if garden.user_id != current_user.id:
        return jsonify({"error": "Unauthorized."}), 403
    
    data = request.get_json()
    garden.name = data.get('name')
    garden.garden_type = data.get('garden_type')
    garden.location_city = data.get('location_city')
    garden.location_country = data.get('location_country')
    db.session.commit()
    
    return jsonify({"message": "Garden updated successfully!"})

@views.route('/garden/delete/<int:garden_id>', methods=['POST'])
@login_required
def delete_garden(garden_id):
    garden = Garden.query.get_or_404(garden_id)
    if garden.user_id != current_user.id:
        return jsonify({"error": "Unauthorized."}), 403
    
    db.session.delete(garden)
    db.session.commit()
    
    return jsonify({"message": "Garden deleted successfully!"})

@views.route('/plant/add', methods=['POST'])
@login_required
def add_plant():
    data = request.get_json()
    name = data.get('name')
    type_ = data.get('type')
    environment = data.get('environment')
    care_guide = data.get('care_guide')
    ideal_soil_type = data.get('ideal_soil_type')
    watering_frequency = data.get('watering_frequency')
    fertilizing_frequency = data.get('fertilizing_frequency')
    pruning_frequency = data.get('pruning_frequency')
    garden_id = data.get('garden_id')
    planting_date = data.get('planting_date')
    
    if not name or not type_ or not environment or not care_guide or not garden_id or not planting_date:
        return jsonify({"error": "Missing required fields."}), 400
    
    plant = Plant(
        name=name, 
        type=type_, 
        environment=environment, 
        care_guide=care_guide, 
        ideal_soil_type=ideal_soil_type, 
        watering_frequency=watering_frequency, 
        fertilizing_frequency=fertilizing_frequency, 
        pruning_frequency=pruning_frequency
    )
    db.session.add(plant)
    db.session.commit()
    
    tracking = PlantTracking(garden_id=garden_id, plant_id=plant.id, planting_date=planting_date)
    db.session.add(tracking)
    db.session.commit()
    
    return jsonify({"message": "Plant added successfully!", "plant_id": plant.id})

@views.route('/plant/edit/<int:tracking_id>', methods=['POST'])
@login_required
def edit_plant(tracking_id):
    tracking = PlantTracking.query.get_or_404(tracking_id)
    garden = Garden.query.get(tracking.garden_id)
    if garden.user_id != current_user.id:
        return jsonify({"error": "Unauthorized."}), 403
    
    data = request.get_json()
    plant = Plant.query.get(tracking.plant_id)
    plant.name = data.get('name')
    plant.type = data.get('type')
    plant.environment = data.get('environment')
    plant.care_guide = data.get('care_guide')
    plant.ideal_soil_type = data.get('ideal_soil_type')
    plant.watering_frequency = data.get('watering_frequency')
    plant.fertilizing_frequency = data.get('fertilizing_frequency')
    plant.pruning_frequency = data.get('pruning_frequency')
    tracking.planting_date = data.get('planting_date')
    db.session.commit()
    
    return jsonify({"message": "Plant updated successfully!"})

@views.route('/plant/delete/<int:tracking_id>', methods=['POST'])
@login_required
def delete_plant(tracking_id):
    tracking = PlantTracking.query.get_or_404(tracking_id)
    garden = Garden.query.get(tracking.garden_id)
    if garden.user_id != current_user.id:
        return jsonify({"error": "Unauthorized."}), 403
    
    db.session.delete(tracking)
    db.session.commit()
    
    return jsonify({"message": "Plant deleted successfully!"})

@views.route('/smart-alerts')
@login_required
def smart_alerts():
    # Get user's plants and generate alerts based on care schedules
    plant_trackings = PlantTracking.query.join(Garden).filter(Garden.user_id == current_user.id).all()
    
    alerts = []
    today = datetime.now().date()
    
    for pt in plant_trackings:
        plant = Plant.query.get(pt.plant_id)
        if not plant:
            continue
            
        # Check watering schedule
        if plant.watering_frequency:
            days_since_watered = (today - pt.last_watered).days if pt.last_watered else 999
            if days_since_watered >= plant.watering_frequency:
                alerts.append({
                    'id': f"water_{pt.id}",
                    'type': 'watering',
                    'plant_name': plant.name,
                    'garden_name': pt.garden.name,
                    'message': f'Time to water your {plant.name}',
                    'due_date': (pt.last_watered + timedelta(days=plant.watering_frequency)).isoformat() if pt.last_watered else today.isoformat(),
                    'priority': 'high' if days_since_watered > plant.watering_frequency + 2 else 'medium',
                    'status': 'overdue' if days_since_watered > plant.watering_frequency else 'pending'
                })
        
        # Check fertilizing schedule
        if plant.fertilizing_frequency:
            days_since_fertilized = (today - pt.last_fertilized).days if pt.last_fertilized else 999
            if days_since_fertilized >= plant.fertilizing_frequency:
                alerts.append({
                    'id': f"fertilize_{pt.id}",
                    'type': 'fertilizing',
                    'plant_name': plant.name,
                    'garden_name': pt.garden.name,
                    'message': f'Your {plant.name} needs fertilizer',
                    'due_date': (pt.last_fertilized + timedelta(days=plant.fertilizing_frequency)).isoformat() if pt.last_fertilized else today.isoformat(),
                    'priority': 'medium',
                    'status': 'overdue' if days_since_fertilized > plant.fertilizing_frequency else 'pending'
                })
        
        # Check pruning schedule
        if plant.pruning_frequency:
            days_since_pruned = (today - pt.last_pruned).days if pt.last_pruned else 999
            if days_since_pruned >= plant.pruning_frequency:
                alerts.append({
                    'id': f"prune_{pt.id}",
                    'type': 'pruning',
                    'plant_name': plant.name,
                    'garden_name': pt.garden.name,
                    'message': f'Time to prune your {plant.name}',
                    'due_date': (pt.last_pruned + timedelta(days=plant.pruning_frequency)).isoformat() if pt.last_pruned else today.isoformat(),
                    'priority': 'low',
                    'status': 'overdue' if days_since_pruned > plant.pruning_frequency else 'pending'
                })
    
    return jsonify({"alerts": alerts})

@views.route('/features')
@login_required
def features():
    return jsonify({"message": "Features feature"})

@views.route('/about')
def about():
    return jsonify({"message": "About feature"})

@views.route('/admin/reports')
@login_required
def admin_reports():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
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
    
    return jsonify({
        "message": "Admin reports",
        "stats": {
            "total_users": total_users,
            "active_users": active_users,
            "subscribed_users": subscribed_users,
            "total_admins": total_admins,
            "recent_users": [{"id": u.id, "email": u.email, "full_name": u.full_name} for u in recent_users],
            "user_activity": user_activity
        }
    })

@views.route('/admin/feedback')
@login_required
def admin_feedback():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    # Get feedback data (placeholder for now)
    feedback_list = [
        {
            'id': 1,
            'user_email': 'john.doe@example.com',
            'subject': 'Bug Report',
            'message': 'The camera feature is not working properly on mobile devices.',
            'status': 'pending',
            'created_at': datetime.now().isoformat()
        },
        {
            'id': 2,
            'user_email': 'jane.smith@example.com',
            'subject': 'Feature Request',
            'message': 'Would love to have more plant varieties in the database.',
            'status': 'reviewed',
            'created_at': datetime.now().isoformat()
        },
        {
            'id': 3,
            'user_email': 'mike.wilson@example.com',
            'subject': 'General Inquiry',
            'message': 'How do I reset my password?',
            'status': 'resolved',
            'created_at': datetime.now().isoformat()
        }
    ]
    
    return jsonify({"feedback_list": feedback_list})

@views.route('/admin/feedback/<int:feedback_id>/update', methods=['POST'])
@login_required
def update_feedback_status(feedback_id):
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    data = request.get_json()
    status = data.get('status')
    # Here you would update the feedback status in the database
    # For now, just flash a message
    return jsonify({"message": f"Feedback status updated to {status}."})

@views.route('/admin/system-content')
@login_required
def admin_system_content():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
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
    
    return jsonify({
        "message": "Admin system content",
        "ai_data": ai_data,
        "learning_paths": learning_paths,
        "seasonal_content": seasonal_content,
        "notification_templates": notification_templates
    })

@views.route('/admin/ai-data', methods=['GET', 'POST'])
@login_required
def admin_ai_data():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    if request.method == 'POST':
        # Handle AI data updates
        return jsonify({"message": "AI data updated successfully!"})
    
    return jsonify({"message": "Admin AI data"})

@views.route('/admin/learning-paths', methods=['GET', 'POST'])
@login_required
def admin_learning_paths():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    if request.method == 'POST':
        # Handle learning path updates
        return jsonify({"message": "Learning paths updated successfully!"})
    
    return jsonify({"message": "Admin learning paths"})

@views.route('/admin/notifications', methods=['GET', 'POST'])
@login_required
def admin_notifications():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    if request.method == 'POST':
        # Handle notification template updates
        return jsonify({"message": "Notification templates updated successfully!"})
    
    return jsonify({"message": "Admin notifications"})

@views.route('/admin/seasonal-planning', methods=['GET', 'POST'])
@login_required
def admin_seasonal_planning():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    if request.method == 'POST':
        # Handle seasonal content updates
        return jsonify({"message": "Seasonal content updated successfully!"})
    
    return jsonify({"message": "Admin seasonal planning"})

@views.route('/admin/rollback-content', methods=['GET', 'POST'])
@login_required
def admin_rollback_content():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    if request.method == 'POST':
        # Handle content rollback
        return jsonify({"message": "Content rollback completed successfully!"})
    
    return jsonify({"message": "Admin rollback content"})

@views.route('/admin/users')
@login_required
def admin_users():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    users = User.query.all()
    return jsonify({
        "users": [{
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "contact": u.contact,
            "role": u.role,
            "is_active": u.is_active,
            "created_at": u.created_at.isoformat() if u.created_at else None
        } for u in users]
    })

@views.route('/admin/users/<int:user_id>/status', methods=['PUT'])
@login_required
def admin_user_status(user_id):
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    data = request.get_json()
    is_active = data.get('is_active')
    
    user = User.query.get_or_404(user_id)
    user.is_active = is_active
    db.session.commit()
    
    return jsonify({"message": f"User status updated successfully"})

@views.route('/admin/users/<int:user_id>', methods=['DELETE'])
@login_required
def admin_delete_user(user_id):
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"message": "User deleted successfully"})

@views.route('/admin/feedbacks')
@login_required
def admin_feedbacks():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    # This would typically come from a Feedback model
    # For now, returning placeholder data
    feedbacks = [
        {
            "id": 1,
            "subject": "Camera feature not working",
            "message": "The camera feature is not working properly on mobile devices.",
            "status": "pending",
            "user": {"full_name": "John Doe", "email": "john@example.com"},
            "created_at": datetime.now().isoformat()
        },
        {
            "id": 2,
            "subject": "More plant varieties needed",
            "message": "Would love to have more plant varieties in the database.",
            "status": "in_progress",
            "user": {"full_name": "Jane Smith", "email": "jane@example.com"},
            "created_at": datetime.now().isoformat()
        }
    ]
    
    return jsonify({"feedbacks": feedbacks})

@views.route('/admin/feedbacks/<int:feedback_id>/status', methods=['PUT'])
@login_required
def admin_feedback_status(feedback_id):
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    data = request.get_json()
    status = data.get('status')
    
    # This would typically update a Feedback model
    # For now, just return success
    
    return jsonify({"message": "Feedback status updated successfully"})

@views.route('/feedback/submit', methods=['POST'])
@login_required
def submit_feedback():
    data = request.get_json()
    subject = data.get('subject')
    message = data.get('message')
    rating = data.get('rating', 5)
    category = data.get('category', 'general')
    
    if not subject or not message:
        return jsonify({"error": "Subject and message are required."}), 400
    
    # This would typically save to a Feedback model
    # For now, just return success
    
    return jsonify({"success": True, "message": "Feedback submitted successfully!"})

@views.route('/feedback/user')
@login_required
def user_feedbacks():
    # This would typically fetch from a Feedback model
    # For now, returning placeholder data
    feedbacks = [
        {
            "id": 1,
            "subject": "Great app!",
            "message": "Really enjoying using eGrowtify for my garden management.",
            "rating": 5,
            "category": "general",
            "status": "resolved",
            "admin_response": "Thank you for your feedback! We're glad you're enjoying the app.",
            "created_at": datetime.now().isoformat()
        }
    ]
    
    return jsonify({"feedbacks": feedbacks})
