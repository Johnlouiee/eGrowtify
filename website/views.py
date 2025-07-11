from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from . import mysql
from .models import db, User, Admin, Garden, Plant, PlantTracking

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
    if not isinstance(current_user, Admin):
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
    if not isinstance(current_user, Admin):
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
    if isinstance(current_user, Admin):
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

@views.route('/about')
def about():
    return render_template('about.html')
