# eGrowtify - Smart Garden Management System

A modern web application for smart garden management with AI-powered insights and automated care systems.

## 🚀 Features

### 🌱 **Plant Care Guides**
- **Detailed Care Instructions**: Comprehensive care guides for vegetables, herbs, and fruits
- **Plant-Specific Information**: Watering, fertilizing, and pruning schedules
- **Environment Support**: Indoor, outdoor, and greenhouse gardening
- **Care History Tracking**: Monitor when plants were last watered, fertilized, or pruned

### 🔔 **Smart Alerts (Notification-Based)**
- **Watering Reminders**: Timely notifications based on plant-specific needs
- **Fertilizing Schedule**: Automated reminders for plant nutrition
- **Pruning Alerts**: Maintenance reminders for plant health
- **General Maintenance**: Comprehensive care notifications
- **Priority System**: High, medium, and low priority alerts
- **Snooze Functionality**: Temporarily postpone alerts
- **Status Tracking**: Pending, overdue, and completed task management

### 📅 **Seasonal Planning**
- **Personalized Planting Calendars**: Month-by-month planting guides
- **Location-Based Recommendations**: Tailored to your local environment
- **Seasonal Tips**: Expert advice for each season
- **Plant Recommendations**: Best plants for current season
- **Weather Integration**: Growing season information and frost dates
- **Indoor/Outdoor Planning**: Separate recommendations for different environments

### 🌤️ **Weather Integration**
- **Real-Time Weather Data**: Current conditions for any city worldwide
- **Smart Planting Advice**: Intelligent recommendations based on weather conditions
- **City Search**: Input your location for personalized weather data
- **Default Location**: Cebu, Philippines as the default city
- **Weather Icons**: Visual representation of current conditions
- **Planting Conditions**: Temperature, humidity, wind, and visibility data
- **Fallback Support**: Mock data when API is unavailable

### 🤖 **AI Planting Tool**
- **Plant Recognition**: Upload photos for instant plant identification
- **Health Assessment**: AI-powered plant health analysis
- **Care Recommendations**: Personalized care instructions
- **Disease Detection**: Early warning system for plant issues
- **Growth Stage Analysis**: Identify plant development phases
- **Camera Integration**: Take photos directly in the app
- **Plant Database**: Extensive library of plant information

### 🏡 **Garden Management**
- **Multiple Gardens**: Manage indoor and outdoor gardens
- **Plant Tracking**: Individual plant care history
- **Garden Types**: Vegetable, herb, flower, fruit, and mixed gardens
- **Location Tracking**: City and country-based features
- **Plant Inventory**: Complete plant management system

### 📱 **Mobile & Web Support**
- **Responsive Design**: Works on mobile and desktop
- **Cross-Platform**: Web-based application
- **Real-Time Updates**: Live data synchronization
- **User-Friendly Interface**: Intuitive navigation and design

### 🎯 **Target Audience**
- **Urban Gardeners**: Apartment and small space gardening
- **Rural Gardeners**: Large-scale home gardening
- **Indoor Enthusiasts**: Houseplant and indoor gardening
- **Outdoor Gardeners**: Traditional outdoor gardening
- **All Skill Levels**: Beginner to expert gardeners

## 🏗️ Architecture

- **Frontend**: React.js with Vite, Tailwind CSS
- **Backend**: Python Flask API with MySQL database
- **Authentication**: Flask-Login with session management
- **Database**: MySQL with SQLAlchemy ORM

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MySQL/XAMPP
- Git

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd eGrowtify
```

### 2. Backend Setup (Python/Flask)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up MySQL database
# Import the egrowtify_db.sql file into your MySQL server
# Update database credentials in website/__init__.py if needed

# Run the backend
python main.py
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup (React)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🗄️ Database Setup

1. Start your MySQL server (XAMPP or standalone)
2. Create a database named `egrowtify_db`
3. Import the `egrowtify_db.sql` file
4. Default admin credentials:
   - Username: `admin`
   - Password: `admin123`

## 📁 Project Structure

```
eGrowtify/
├── src/                    # React frontend source
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── website/                # Python Flask backend
│   ├── __init__.py        # Flask app factory
│   ├── models.py          # Database models
│   ├── auth.py            # Authentication routes
│   └── views.py           # Main routes
├── main.py                # Backend entry point
├── requirements.txt        # Python dependencies
├── package.json           # Node.js dependencies
└── README.md              # This file
```

## 🔧 Development

### Backend Development

- The Flask app serves as an API backend
- CORS is enabled for the React frontend
- Database models are defined in `website/models.py`
- Authentication routes are in `website/auth.py`

### Frontend Development

- Built with React 18 and modern hooks
- Uses Vite for fast development and building
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management

## 🚀 Deployment

### Backend Deployment

```bash
# Install production dependencies
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 main:app
```

### Frontend Deployment

```bash
# Build for production
npm run build

# Serve the dist folder
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@egrowtify.com or create an issue in the repository.

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
FLASK_SECRET_KEY=your_secret_key_here
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=egrowtify_db
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### API Keys Setup

- **OpenWeatherMap API**: Get your free API key from [OpenWeatherMap](https://openweathermap.org/api) for weather data
- **Plant.id API**: Optional, for AI plant recognition features
- **OpenAI API**: Optional, for enhanced AI analysis features

See `WEATHER_SETUP.md` for detailed weather API setup instructions.

## 📱 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `python main.py` - Run Flask development server
- `python create_admin.py` - Create admin accounts
- `python reset_database.py` - Reset database (development only)
