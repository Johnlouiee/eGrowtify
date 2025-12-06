from flask import Flask, jsonify
from flask_cors import CORS
from website import create_app
import os

app = create_app()

# CORS configuration - update with your production frontend URL
allowed_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, origins=allowed_origins, supports_credentials=True)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to eGrowtify API"})

@app.route('/test')
def test():
    return jsonify({"status": "Flask backend is running!"})

# API routes for new features
@app.route('/api/smart-alerts')
def api_smart_alerts():
    from website.views import smart_alerts
    return smart_alerts()

@app.route('/api/ai-recognition', methods=['POST'])
def api_ai_recognition():
    from website.views import ai_plant_recognition
    return ai_plant_recognition()

@app.route('/api/soil-analysis', methods=['POST'])
def api_soil_analysis():
    from website.views import soil_analysis
    return soil_analysis()

@app.route('/api/seasonal-planning')
def api_seasonal_planning():
    from website.views import seasonal_planning
    return seasonal_planning()

@app.route('/api/verify-email', methods=['GET', 'POST'])
def api_verify_email():
    from website.auth import verify_email
    return verify_email()

@app.route('/api/weather-forecast')
def api_weather_forecast():
    from website.views import get_weather_forecast
    return get_weather_forecast()

@app.route('/api/soil-temperature')
def api_soil_temperature():
    from website.views import get_soil_temperature
    return get_soil_temperature()

@app.route('/api/plant-weather-tolerance')
def api_plant_weather_tolerance():
    from website.views import get_plant_weather_tolerance
    return get_plant_weather_tolerance()

@app.route('/api/resend-verification', methods=['POST'])
def api_resend_verification():
    from website.auth import resend_verification
    return resend_verification()

@app.route('/api/weather')
def api_weather():
    from website.views import get_weather
    return get_weather()

if __name__ == '__main__':
    import os
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    host = os.getenv('HOST', '127.0.0.1')
    
    print("Starting Flask Backend...")
    print(f"Backend will run on: http://{host}:{port}")
    print("API endpoints available:")
    print("   - GET / - Welcome message")
    print("   - GET /test - Test endpoint")
    print("")
    if debug:
        print("To see the UI, run 'npm run dev' in another terminal")
        print("   Then visit: http://localhost:3000")
    print("")
    app.run(debug=debug, host=host, port=port)