from flask import Blueprint, jsonify, request, flash, redirect, url_for
from flask_login import login_required, current_user
from . import mysql
from .models import db, User, Admin, Garden, Plant, PlantTracking
from datetime import datetime, timedelta
import os
import base64
import requests

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

    try:
        api_key = os.getenv('PLANT_ID_API_KEY')
        if not api_key:
            # Return graceful message with 200 so frontend doesn't throw
            return jsonify({"error": "Missing PLANT_ID_API_KEY. Add it to .env and restart backend."}), 200

        file = request.files.get('image')
        if not file:
            return jsonify({"error": "Image file is required (field name: 'image')."}), 200

        # Read and base64 encode image
        image_bytes = file.read()
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')

        payload = {
            "images": [image_b64],
            "modifiers": ["similar_images"],
            "plant_language": "en",
            "plant_details": [
                "common_names",
                "edible_parts",
                "url",
                "wiki_description"
            ]
        }
        headers = {"Content-Type": "application/json", "Api-Key": api_key}
        resp = requests.post("https://api.plant.id/v2/identify", json=payload, headers=headers, timeout=30)

        if resp.status_code != 200:
            return jsonify({"error": f"Plant.id error {resp.status_code}: {resp.text}"}), 200

        data = resp.json()
        suggestions = data.get('suggestions', [])
        if not suggestions:
            return jsonify({"error": "No match found. Try a clearer photo."}), 200

        top = suggestions[0]
        name = top.get('plant_name') or top.get('name')
        probability = float(top.get('probability', 0)) * 100.0
        details = top.get('plant_details', {})
        common_names = details.get('common_names') or []
        wiki = details.get('wiki_description', {})

        display_name = (common_names[0] if common_names else None) or name or 'Unknown'
        result = {
            'plant_name': display_name,
            'scientific_name': name,
            'common_names': common_names,
            'confidence': round(probability, 1),
            'health_status': 'Unknown',
            'care_recommendations': {
                'watering': 'Water as needed; keep soil appropriate for species',
                'sunlight': 'Provide suitable sun exposure for species',
                'soil': 'Well-draining soil is recommended'
            },
            'common_issues': [],
            'growth_stage': 'Unknown',
            'estimated_yield': 'N/A',
            'info_url': details.get('url')
        }

        return jsonify(result)
    except Exception as e:
        # Fallback to simple on-device heuristic so the feature still works offline
        try:
            file = request.files.get('image')
            if not file:
                return jsonify({"error": f"Analysis failed: {str(e)}"}), 500
            from PIL import Image
            import numpy as np
            image = Image.open(file.stream).convert('RGB').resize((256, 256))
            arr = np.asarray(image, dtype=np.float32)
            red = arr[:, :, 0]
            green = arr[:, :, 1]
            blue = arr[:, :, 2]
            total = np.maximum(red + green + blue, 1.0)
            green_ratio = float(np.mean(green / total))
            red_ratio = float(np.mean(red / total))
            health = 'Healthy' if green_ratio > 0.33 else 'Possible dryness or nutrient deficiency'
            label = 'Leafy Plant' if green_ratio >= 0.37 else 'Fruit/Flower'
            confidence = round(60 + green_ratio * 40, 1)
            return jsonify({
                'plant_name': label,
                'confidence': confidence,
                'health_status': health,
                'care_recommendations': {
                    'watering': 'Keep soil appropriately moist',
                    'sunlight': 'Provide suitable sun exposure',
                    'soil': 'Well-draining soil'
                },
                'common_issues': [],
                'growth_stage': 'Unknown',
                'estimated_yield': 'N/A'
            })
        except Exception:
            return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

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
    # Only regular users can manage gardens
    if hasattr(current_user, 'is_admin') and current_user.is_admin():
        return jsonify({"error": "Only user accounts can access gardens. Please sign in with a user account."}), 403
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
    # Only regular users can create gardens
    if hasattr(current_user, 'is_admin') and current_user.is_admin():
        return jsonify({"error": "Admins cannot create gardens. Please use a user account."}), 403
    try:
        data = request.get_json(force=True, silent=True) or {}
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

        return jsonify({"success": True, "message": "Garden added successfully!", "garden_id": garden.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

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
    # Only regular users can add plants to gardens
    if hasattr(current_user, 'is_admin') and current_user.is_admin():
        return jsonify({"error": "Admins cannot add plants. Please use a user account."}), 403
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
    
    if not type_ or not environment or not care_guide or not garden_id or not planting_date:
        return jsonify({"error": "Missing required fields."}), 400

    # Default name to type if not provided
    if not name:
        name = str(type_).strip().title()
    
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
    if 'name' in data and data.get('name'):
        plant.name = data.get('name')
    if 'type' in data and data.get('type'):
        plant.type = data.get('type')
    if 'environment' in data and data.get('environment'):
        plant.environment = data.get('environment')
    if 'care_guide' in data and data.get('care_guide'):
        plant.care_guide = data.get('care_guide')
    if 'ideal_soil_type' in data:
        plant.ideal_soil_type = data.get('ideal_soil_type')
    if 'watering_frequency' in data:
        plant.watering_frequency = data.get('watering_frequency')
    if 'fertilizing_frequency' in data:
        plant.fertilizing_frequency = data.get('fertilizing_frequency')
    if 'pruning_frequency' in data:
        plant.pruning_frequency = data.get('pruning_frequency')
    if 'planting_date' in data and data.get('planting_date'):
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
