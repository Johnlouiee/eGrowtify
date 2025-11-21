# eGrowtify System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [System Architecture](#system-architecture)
3. [System Flow](#system-flow)
4. [Features & Functionalities](#features--functionalities)
5. [User Guide](#user-guide)
6. [Admin Guide](#admin-guide)
7. [Technical Documentation](#technical-documentation)
8. [API Documentation](#api-documentation)
9. [Database Structure](#database-structure)
10. [Setup & Installation](#setup--installation)
11. [Deployment Guide](#deployment-guide)

---

## System Overview

**eGrowtify** is a comprehensive smart garden management system designed for gardeners in the Philippines. It combines AI-powered plant recognition, soil analysis, seasonal planning, and automated care reminders to help users grow healthy plants.

### Key Capabilities
- 🌱 **Plant Management**: Track and manage multiple gardens and plants
- 🤖 **AI Recognition**: Identify plants and analyze soil using AI
- 📅 **Seasonal Planning**: Get personalized planting recommendations
- 🔔 **Smart Alerts**: Automated care reminders for watering, fertilizing, and pruning
- 📚 **Learning Paths**: Interactive educational content for all skill levels
- 👥 **User Management**: Admin panel for managing users and content
- 💳 **Subscription System**: Basic and Premium plans with different features

---

## System Architecture

### Technology Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- React Hot Toast for notifications
- Lucide React for icons

**Backend:**
- Python 3.8+
- Flask web framework
- SQLAlchemy ORM
- MySQL database
- Flask-Login for authentication
- OpenAI API for AI features
- OpenWeatherMap API for weather data

### Architecture Pattern
- **Frontend-Backend Separation**: React SPA communicates with Flask REST API
- **RESTful API**: Backend exposes REST endpoints
- **Session-Based Auth**: Flask-Login manages user sessions
- **Database ORM**: SQLAlchemy abstracts database operations

### Project Structure

```
eGrowtify/
├── src/                          # React Frontend
│   ├── components/              # Reusable UI components
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── Footer.jsx          # Footer component
│   │   ├── GridPlanner.jsx     # Garden grid planner
│   │   ├── WeatherCard.jsx     # Weather display
│   │   ├── AdminRoute.jsx      # Admin route protection
│   │   ├── UserRoute.jsx       # User route protection
│   │   └── PrivateRoute.jsx    # General route protection
│   ├── pages/                   # Page components
│   │   ├── Home.jsx            # Landing page
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx         # Registration page
│   │   ├── UserDashboard.jsx   # User dashboard
│   │   ├── Garden.jsx           # Garden management
│   │   ├── Profile.jsx         # User profile
│   │   ├── AIPlantRecognition.jsx  # AI plant/soil analysis
│   │   ├── SmartAlerts.jsx     # Alerts management
│   │   ├── SeasonalPlanning.jsx   # Seasonal planning
│   │   ├── Subscription.jsx    # Subscription management
│   │   ├── admin/              # Admin pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── ManageNotifications.jsx
│   │   │   └── ...
│   │   └── ...
│   ├── contexts/               # React contexts
│   │   └── AuthContext.jsx     # Authentication context
│   ├── services/                # Service modules
│   │   ├── authService.js      # Auth service
│   │   └── weatherService.js   # Weather service
│   ├── utils/                   # Utility functions
│   │   ├── learningPathData.js
│   │   └── clearProgressData.js
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
│
├── website/                     # Flask Backend
│   ├── __init__.py             # Flask app factory
│   ├── models.py               # Database models
│   ├── auth.py                 # Authentication routes
│   ├── views.py                # Main API routes
│   └── email_service.py        # Email service
│
├── main.py                     # Backend entry point
├── requirements.txt            # Python dependencies
├── package.json                # Node.js dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
└── egrowtifydb.sql             # Database schema
```

---

## System Flow

### Authentication Flow

```
1. User Registration
   ├── User fills registration form
   ├── Backend creates user account (is_active=false)
   ├── Email verification token generated
   ├── Verification email sent
   └── User must verify email before login

2. Email Verification
   ├── User clicks verification link
   ├── Backend validates token
   ├── Sets is_active=true
   └── User can now login

3. Login Flow
   ├── User enters email/password
   ├── Backend validates credentials
   ├── Checks email_verified status
   ├── Checks is_active status
   ├── Creates session (Flask-Login)
   ├── Returns user data + auth status
   └── Frontend stores user in AuthContext

4. Session Management
   ├── Frontend checks /auth/status on app load
   ├── Backend validates session cookie
   ├── Returns user data if authenticated
   └── Frontend updates AuthContext
```

### User Journey Flow

```
1. New User
   ├── Visits homepage (/)
   ├── Registers account (/register)
   ├── Verifies email (/verify-email)
   ├── Logs in (/login)
   └── Redirected to Dashboard (/dashboard)

2. Authenticated User
   ├── Dashboard: Overview of gardens, plants, alerts
   ├── Garden: Create/manage gardens and plants
   ├── AI Recognition: Analyze plants and soil
   ├── Smart Alerts: View and manage care reminders
   ├── Seasonal Planning: Get planting recommendations
   ├── Learning Paths: Educational content
   ├── Profile: Manage account settings
   └── Subscription: Upgrade to Premium

3. Admin User
   ├── Admin Dashboard: System overview
   ├── User Management: Manage users
   ├── Content Management: Manage learning paths, notifications
   ├── Reports: View system analytics
   └── Activity Logs: Monitor system activity
```

### Data Flow

```
Frontend (React)
    ↓ HTTP Request (Axios)
Backend API (Flask)
    ↓ SQLAlchemy ORM
MySQL Database
    ↓ Response
Backend API
    ↓ JSON Response
Frontend (React)
    ↓ State Update
UI Update
```

---

## Features & Functionalities

### 1. User Authentication & Profile

**Location**: 
- Login: `/login`
- Register: `/register`
- Profile: `/profile`

**Features**:
- User registration with email verification
- Secure login with session management
- Profile management (name, email, phone, photo)
- Password change
- Account deletion
- Profile photo upload

**How to Access**:
- Click "Login" or "Register" in navbar
- Click "Profile" in navbar dropdown
- Profile photo is clickable for full-size view

### 2. Garden Management

**Location**: `/garden`

**Features**:
- Create multiple gardens (indoor/outdoor)
- Add plants to gardens
- Track plant care history
- Grid-based garden visualization
- Plant status tracking
- Garden types: Vegetable, Herb, Flower, Fruit, Mixed

**How to Access**:
- Click "My Plants" in navbar
- Or navigate to `/garden`

**Key Functionalities**:
- **Create Garden**: Click "Add Garden" button
- **Add Plant**: Click "Add Plant" in a garden
- **Edit Plant**: Click edit icon on plant card
- **Delete Plant**: Click delete icon on plant card
- **View Details**: Click on plant to see full details

### 3. AI Plant Recognition & Soil Analysis

**Location**: `/ai-recognition`

**Features**:
- Plant identification from photos
- Plant health assessment
- Soil analysis with recommendations
- Philippine-specific plant recommendations
- Detailed care instructions

**How to Access**:
- Click "AI Recognition" in navbar
- Select "Plant" or "Soil" tab
- Upload photo or use camera

**Workflow**:
1. Select analysis mode (Plant or Soil)
2. Upload image or take photo
3. AI analyzes the image
4. View results with recommendations
5. See recommended plants for soil type

### 4. Smart Alerts

**Location**: `/smart-alerts`

**Features**:
- Watering reminders
- Fertilizing schedules
- Pruning alerts
- Priority-based notifications
- Snooze functionality
- Mark as completed

**How to Access**:
- Click "Alerts" in navbar
- Or navigate to `/smart-alerts`

**Alert Types**:
- **High Priority**: Overdue tasks (red)
- **Medium Priority**: Due soon (yellow)
- **Low Priority**: Upcoming (blue)

### 5. Seasonal Planning

**Location**: `/seasonal-planning`

**Features**:
- Month-by-month planting calendar
- Location-based recommendations (Philippines)
- Indoor/outdoor planting guides
- Weather integration
- Best planting times
- Recommended plants per season

**How to Access**:
- Click "Seasonal Planning" in navbar
- Select month and location
- View recommended plants

### 6. Learning Paths

**Location**: 
- Beginner: `/learning/beginner`
- Intermediate: `/learning/intermediate`
- Expert: `/learning/expert`

**Features**:
- Interactive lessons
- Quizzes and assessments
- Progress tracking
- Module completion
- Difficulty-based content

**How to Access**:
- Click "Community Hub" → Learning Paths
- Or navigate directly to learning path URLs

### 7. Subscription Management

**Location**: `/subscription`

**Features**:
- View current plan (Basic/Premium)
- Upgrade to Premium
- View subscription details
- Billing history
- Cancel subscription

**Plans**:
- **Basic Plan**: Free
  - 4 free AI analyses/month
  - 3×3 grid planner
  - Basic features
  
- **Premium Plan**: ₱150/month
  - 20 free AI analyses/month
  - 6×6 grid planner
  - Advanced features
  - Priority support

**How to Access**:
- Click "Profile" → "Subscription"
- Or navigate to `/subscription`

### 8. Community Hub

**Location**: `/community/concepts`

**Features**:
- Share gardening concepts
- View community contributions
- Search concepts
- Filter by tags

### 9. Feedback System

**Location**: `/feedback`

**Features**:
- Submit feedback
- Report issues
- Feature requests
- View feedback status

---

## User Guide

### Getting Started

1. **Register Account**
   - Go to `/register`
   - Fill in: Full Name, Email, Password, Phone
   - Submit registration
   - Check email for verification link

2. **Verify Email**
   - Click verification link in email
   - Or go to `/verify-email` and enter token
   - Account becomes active

3. **Login**
   - Go to `/login`
   - Enter email and password
   - Click "Login"
   - Redirected to dashboard

### Managing Your Garden

1. **Create a Garden**
   - Go to `/garden`
   - Click "Add Garden" or "Create New Garden"
   - Fill in: Name, Type, Location
   - Select grid size (3×3 for Basic, 6×6 for Premium)
   - Save garden

2. **Add Plants**
   - Click on a garden
   - Click "Add Plant"
   - Select plant from database
   - Set planting date and environment
   - Save plant

3. **Track Plant Care**
   - View plant details
   - Record watering, fertilizing, pruning
   - View care history

### Using AI Recognition

1. **Plant Analysis**
   - Go to `/ai-recognition`
   - Select "Plant" tab
   - Upload plant photo or use camera
   - Click "Analyze Plant"
   - View results: identification, health, care tips

2. **Soil Analysis**
   - Select "Soil" tab
   - Upload soil photo
   - Click "Analyze Soil"
   - View: moisture, texture, pH, recommendations
   - Click "View Plant Recommendations" for Philippine plants

### Managing Alerts

1. **View Alerts**
   - Go to `/smart-alerts`
   - See all pending alerts
   - Filter by priority or type

2. **Complete Alert**
   - Click "Mark as Completed"
   - Alert moves to completed section

3. **Snooze Alert**
   - Click "Snooze"
   - Select duration
   - Alert reappears after duration

### Seasonal Planning

1. **View Calendar**
   - Go to `/seasonal-planning`
   - Select month
   - Select location (city in Philippines)
   - View recommended plants

2. **Get Recommendations**
   - Click "View Recommended Plants"
   - See categorized plants (Vegetables, Fruits, Herbs, Flowers)
   - View planting details

### Learning Paths

1. **Start Learning**
   - Go to `/learning/beginner` (or intermediate/expert)
   - Click "Start Module"
   - Read lessons
   - Complete quizzes
   - Track progress

2. **View Progress**
   - See completion percentage
   - View completed modules
   - Continue where you left off

---

## Admin Guide

### Admin Dashboard

**Location**: `/admin/dashboard`

**Features**:
- System statistics
- User overview
- Recent activity
- Quick actions

### User Management

**Location**: `/admin/users`

**Features**:
- View all users
- Filter by role, status, subscription
- Search users
- View user details
- Lock/Unlock users
- Upgrade/Downgrade subscriptions
- Delete users (with privacy protection - no editing)

**Actions Available**:
- **View**: See user details
- **Lock/Unlock**: Activate/deactivate user account
- **Upgrade/Premium**: Manage subscription status
- **Delete**: Remove user account (handles all related data)

**Privacy Note**: Edit functionality is removed for privacy protection.

### Content Management

**Location**: `/admin/learning-paths`, `/admin/seasonal-content`, `/admin/notifications`

**Features**:
- Manage learning path content
- Update seasonal planting recommendations
- Create and manage notifications
- Upload media files

### Subscription Management

**Location**: `/admin/subscription`

**Features**:
- View all subscribers
- Manage subscription plans
- View billing history
- Subscription analytics

### Reports & Analytics

**Location**: `/admin/reports`

**Features**:
- User statistics
- Subscription analytics
- Activity logs
- System performance metrics

### Activity Logs

**Location**: `/admin/activity-logs`

**Features**:
- View user activities
- System events
- Filter by date, user, action
- Export logs

---

## Technical Documentation

### Frontend Architecture

**State Management**:
- React Context API for global state (AuthContext)
- Local state with useState for component state
- No external state management library

**Routing**:
- React Router v6
- Protected routes with UserRoute, AdminRoute components
- Public routes: Home, Login, Register, Features, About

**API Communication**:
- Axios with baseURL: `/api`
- Proxy configuration in vite.config.js
- Automatic credential handling (withCredentials: true)

**Styling**:
- Tailwind CSS utility classes
- Custom CSS in index.css
- Responsive design (mobile-first)

### Backend Architecture

**Application Structure**:
- Flask application factory pattern
- Blueprint-based routing (auth, views)
- SQLAlchemy ORM for database

**Authentication**:
- Flask-Login for session management
- Email verification required
- Role-based access control (user/admin)

**Error Handling**:
- Try-catch blocks with rollback
- JSON error responses
- Detailed error logging

### Database Models

**Core Models**:
- `User`: User accounts
- `Admin`: Admin accounts
- `Garden`: User gardens
- `PlantTracking`: Plant records
- `GridSpace`: Garden grid spaces
- `UserSubscription`: Subscription records
- `ActivityLog`: User activity tracking
- `Feedback`: User feedback
- `Notification`: Alert notifications

**Relationships**:
- User → Gardens (1:many, CASCADE delete)
- Garden → PlantTracking (1:many, CASCADE delete)
- User → UserSubscription (1:many, CASCADE delete)
- User → ActivityLog (1:many, manual delete)
- User → Feedback (1:many, SET NULL)

---

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body**:
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "contact": "09123456789"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email."
}
```

#### POST `/api/auth/login`
Login user.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "user",
    "is_active": true
  },
  "is_admin": false,
  "is_premium": false
}
```

#### GET `/api/auth/status`
Get current authentication status.

**Response**:
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "user",
    "is_active": true,
    "created_at": "2025-11-20T00:00:00",
    "subscribed": false,
    "subscription_plan": "basic"
  },
  "is_admin": false,
  "is_premium": false
}
```

#### POST `/api/auth/logout`
Logout current user.

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### PUT `/api/auth/change-password`
Change user password.

**Request Body**:
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password changed successfully!"
}
```

#### DELETE `/api/profile/delete`
Delete user account.

**Response**:
```json
{
  "success": true,
  "message": "Account deleted successfully. All your data has been removed."
}
```

### Profile Endpoints

#### GET `/api/profile`
Get user profile data.

**Response**:
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone": "09123456789",
    "role": "user",
    "is_active": true,
    "created_at": "2025-11-20T00:00:00"
  }
}
```

#### PUT `/api/profile`
Update user profile.

**Request Body**:
```json
{
  "full_name": "John Updated",
  "email": "newemail@example.com",
  "phone": "09987654321"
}
```

#### POST `/api/profile/photo`
Upload profile photo.

**Request**: multipart/form-data with `photo` field

**Response**:
```json
{
  "success": true,
  "path": "/uploads/profiles/user_1_photo.jpg"
}
```

### Garden Endpoints

#### GET `/api/garden`
Get all user gardens.

**Response**:
```json
{
  "gardens": [
    {
      "id": 1,
      "name": "My Backyard Garden",
      "garden_type": "vegetable",
      "location_city": "Manila",
      "location_country": "Philippines",
      "grid_size": "3x3"
    }
  ]
}
```

#### POST `/api/garden`
Create new garden.

**Request Body**:
```json
{
  "name": "New Garden",
  "garden_type": "vegetable",
  "location_city": "Manila",
  "location_country": "Philippines",
  "grid_size": "3x3"
}
```

#### PUT `/api/garden/<id>`
Update garden.

#### DELETE `/api/garden/<id>`
Delete garden.

### Plant Endpoints

#### GET `/api/garden/<garden_id>/plants`
Get plants in a garden.

#### POST `/api/plant`
Add plant to garden.

**Request Body**:
```json
{
  "garden_id": 1,
  "plant_id": 5,
  "environment": "outdoor",
  "planting_date": "2025-11-20"
}
```

#### PUT `/api/plant/<tracking_id>`
Update plant.

#### DELETE `/api/plant/<tracking_id>`
Delete plant.

### AI Recognition Endpoints

#### POST `/api/ai-recognition`
Analyze plant image.

**Request**: multipart/form-data with `image` field

**Response**:
```json
{
  "plant_name": "Tomato",
  "confidence": 0.95,
  "health_status": "healthy",
  "care_instructions": "...",
  "recommendations": [...]
}
```

#### POST `/api/soil-analysis`
Analyze soil image.

**Request**: multipart/form-data with `image` field

**Response**:
```json
{
  "moisture_level": "Moderate",
  "texture": "Loamy",
  "ph": "6.5-7.0",
  "organic_matter": "Good",
  "drainage": "Well-draining",
  "suitable_plants": {
    "vegetables": ["Kangkong", "Talong", "Kamatis"],
    "fruits": ["Mango", "Saging", "Papaya"],
    "herbs": ["Pandan", "Tanglad", "Luya"],
    "flowers": ["Sampaguita", "Gumamela", "Santan"]
  },
  "recommendations": [...],
  "soil_health_score": 7
}
```

### Subscription Endpoints

#### POST `/api/subscription/upgrade`
Upgrade to Premium.

**Request Body**:
```json
{
  "plan_type": "premium",
  "payment_method": "gcash"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Subscription upgraded successfully!",
  "subscription": {
    "plan": "premium",
    "status": "active",
    "start_date": "2025-11-20T00:00:00",
    "end_date": "2025-12-20T00:00:00"
  }
}
```

### Admin Endpoints

#### GET `/api/admin/users`
Get all users (admin only).

#### DELETE `/api/admin/users/<user_id>`
Delete user (admin only).

**Response**:
```json
{
  "message": "User deleted successfully"
}
```

#### PATCH `/api/admin/users/<user_id>/status`
Toggle user status (admin only).

**Request Body**:
```json
{
  "is_active": false
}
```

#### PATCH `/api/admin/users/<user_id>/subscription`
Toggle subscription (admin only).

**Request Body**:
```json
{
  "subscribed": true
}
```

---

## Database Structure

### Core Tables

#### `users`
- `id` (Primary Key)
- `email` (Unique)
- `firstname`, `lastname`
- `contact` (phone)
- `password_hash`
- `role` (user/admin)
- `is_active` (Boolean)
- `subscribed` (Boolean)
- `email_verified` (Boolean)
- `created_at`, `updated_at`

#### `garden`
- `GARDEN_ID` (Primary Key)
- `USER_ID` (Foreign Key → users.id, CASCADE)
- `NAME`
- `GARDEN_TYPE` (vegetable/herb/flower/fruit/mixed)
- `LOCATION_CITY`, `LOCATION_COUNTRY`
- `GRID_SIZE` (3x3, 6x6)
- `CREATED_AT`

#### `planttracking`
- `TRACKING_ID` (Primary Key)
- `GARDEN_ID` (Foreign Key → garden.GARDEN_ID, CASCADE)
- `PLANT_ID` (Foreign Key → plant.PLANT_ID)
- `ENVIRONMENT` (indoor/outdoor)
- `PLANTING_DATE`
- `NOTES`

#### `user_subscriptions`
- `id` (Primary Key)
- `user_id` (Foreign Key → users.id, CASCADE)
- `plan_id` (Foreign Key → subscription_plans.id)
- `start_date`, `end_date`
- `status` (active/cancelled/expired)
- `payment_status`
- `total_paid`

#### `activity_logs`
- `id` (Primary Key)
- `user_id` (Foreign Key → users.id, no CASCADE - manual delete)
- `garden_id`, `space_id`, `plant_id`
- `action` (water/fertilize/prune)
- `action_date`
- `notes`

#### `notifications`
- `id` (Primary Key)
- `user_id` (Foreign Key → users.id, CASCADE)
- `plant_id`, `garden_id`
- `alert_type`
- `due_date`
- `status` (pending/overdue/completed)
- `priority`

### Foreign Key Relationships

**CASCADE Delete** (automatically deleted when user is deleted):
- `garden` → `users`
- `user_subscriptions` → `users`
- `notifications` → `users`
- `ai_usage_tracking` → `users`
- `user_plant_update_usage` → `users`
- `user_shared_concepts` → `users`

**SET NULL** (user_id set to NULL when user is deleted):
- `feedback` → `users`

**Manual Delete Required**:
- `activity_logs` → `users` (must be deleted manually before user deletion)

---

## Setup & Installation

### Prerequisites

- **Node.js** v16 or higher
- **Python** 3.8 or higher
- **MySQL** (XAMPP or standalone)
- **Git**

### Step-by-Step Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd eGrowtify
```

#### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

#### 3. Database Setup

1. Start MySQL server (XAMPP or standalone)
2. Create database: `egrowtifydb`
3. Import schema:
   ```bash
   mysql -u root -p egrowtifydb < egrowtifydb.sql
   ```
4. Or use phpMyAdmin to import `egrowtifydb.sql`

#### 4. Environment Variables

Create `.env` file in root directory:

```env
FLASK_SECRET_KEY=your_secret_key_here
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=egrowtifydb
OPENWEATHER_API_KEY=your_openweather_api_key
OPENAI_API_KEY=your_openai_api_key
```

**Get API Keys**:
- OpenWeatherMap: https://openweathermap.org/api (Free tier available)
- OpenAI: https://platform.openai.com/api-keys (Requires payment)

#### 5. Frontend Setup

```bash
# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

#### 6. Start Backend

```bash
# Make sure virtual environment is activated
python main.py
```

Backend runs on `http://localhost:5000`

#### 7. Create Admin User

```bash
python create_admin_user.py
```

Or use the default admin:
- Email: `admin@egrowtify.com`
- Password: Check database or create new admin

### Verification

1. Open `http://localhost:3000`
2. Should see homepage
3. Try registering a new account
4. Check email for verification (if email service configured)
5. Login and access dashboard

---

## Deployment Guide

### Backend Deployment

#### Using Gunicorn

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 main:app
```

#### Environment Variables for Production

```env
FLASK_ENV=production
FLASK_SECRET_KEY=<strong_secret_key>
MYSQL_HOST=<production_db_host>
MYSQL_USER=<db_user>
MYSQL_PASSWORD=<db_password>
MYSQL_DB=egrowtifydb
```

### Frontend Deployment

#### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production build.

#### Serve with Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/eGrowtify/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Serve with Apache

1. Build frontend: `npm run build`
2. Copy `dist/` contents to Apache document root
3. Configure `.htaccess` for React Router
4. Set up proxy for `/api` to backend

### Database Backup

```bash
# Backup database
mysqldump -u root -p egrowtifydb > backup.sql

# Restore database
mysql -u root -p egrowtifydb < backup.sql
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database `egrowtifydb` exists

#### 2. CORS Errors
- Check `website/__init__.py` CORS configuration
- Verify frontend URL in allowed origins

#### 3. Authentication Issues
- Clear browser cookies
- Check session configuration
- Verify Flask secret key

#### 4. API Errors
- Check backend logs
- Verify API endpoints
- Check network tab in browser DevTools

#### 5. Image Upload Fails
- Check `uploads/` directory permissions
- Verify file size limits
- Check disk space

---

## Security Considerations

### Implemented Security Features

1. **Password Hashing**: Werkzeug password hashing
2. **Email Verification**: Required before account activation
3. **Session Management**: Secure session cookies
4. **CSRF Protection**: Flask-Login session validation
5. **SQL Injection Prevention**: SQLAlchemy ORM
6. **XSS Prevention**: React's built-in escaping
7. **Role-Based Access**: Admin/User separation
8. **Privacy Protection**: No user editing by admins

### Best Practices

- Keep dependencies updated
- Use strong secret keys
- Enable HTTPS in production
- Regular database backups
- Monitor error logs
- Implement rate limiting (future)

---

## Future Enhancements

### Planned Features

1. **Mobile App**: React Native version
2. **Push Notifications**: Browser and mobile push
3. **Social Features**: Share gardens, follow users
4. **Marketplace**: Buy/sell plants and seeds
5. **Expert Consultation**: Connect with gardening experts
6. **Advanced Analytics**: Detailed growth tracking
7. **IoT Integration**: Sensor data integration
8. **Multi-language Support**: Tagalog and other languages

---

## Support & Contact

### Getting Help

- **Documentation**: See this file and README.md
- **Issues**: Check error logs in backend console
- **Email**: support@egrowtify.com

### Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## Appendix

### File Locations Reference

**Frontend Pages**:
- Home: `src/pages/Home.jsx`
- Login: `src/pages/Login.jsx`
- Register: `src/pages/Register.jsx`
- Dashboard: `src/pages/UserDashboard.jsx`
- Garden: `src/pages/Garden.jsx`
- Profile: `src/pages/Profile.jsx`
- AI Recognition: `src/pages/AIPlantRecognition.jsx`
- Smart Alerts: `src/pages/SmartAlerts.jsx`
- Seasonal Planning: `src/pages/SeasonalPlanning.jsx`
- Subscription: `src/pages/Subscription.jsx`

**Backend Routes**:
- Authentication: `website/auth.py`
- Main API: `website/views.py`
- Models: `website/models.py`
- App Factory: `website/__init__.py`

**Configuration**:
- Frontend: `vite.config.js`, `tailwind.config.js`
- Backend: `main.py`, `.env`
- Database: `egrowtifydb.sql`

---

**Last Updated**: November 2025
**Version**: 1.0.0
**Maintained By**: eGrowtify Development Team

