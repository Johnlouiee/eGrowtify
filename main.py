from flask import Flask, jsonify
from flask_cors import CORS
from website import create_app

app = create_app()
CORS(app, origins=['http://localhost:3000'], supports_credentials=True)

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

@app.route('/api/seasonal-planning')
def api_seasonal_planning():
    from website.views import seasonal_planning
    return seasonal_planning()

@app.route('/api/verify-email', methods=['POST'])
def api_verify_email():
    from website.auth import verify_email
    return verify_email()

@app.route('/api/resend-verification', methods=['POST'])
def api_resend_verification():
    from website.auth import resend_verification
    return resend_verification()

if __name__ == '__main__':
    print("🚀 Starting Flask Backend...")
    print("📍 Backend will run on: http://127.0.0.1:5000")
    print("🌐 API endpoints available:")
    print("   - GET / - Welcome message")
    print("   - GET /test - Test endpoint")
    print("")
    print("💡 To see the UI, run 'npm run dev' in another terminal")
    print("   Then visit: http://localhost:3000")
    print("")
    app.run(debug=True, host='127.0.0.1', port=5000)