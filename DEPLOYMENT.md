# 🚀 eGrowtify Deployment Guide

This guide covers multiple deployment options for your eGrowtify application.

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Option 1: Render (Recommended for Beginners)](#option-1-render-recommended-for-beginners)
3. [Option 2: Railway](#option-2-railway)
4. [Option 3: VPS (DigitalOcean, AWS EC2)](#option-3-vps-digitalocean-aws-ec2)
5. [Option 4: Docker Deployment](#option-4-docker-deployment)
6. [Frontend Deployment (Vercel/Netlify)](#frontend-deployment-vercelnetlify)

---

## Pre-Deployment Checklist

### ✅ Before You Deploy:

1. **Update Production Configuration**
   - Update CORS origins in `main.py` and `website/__init__.py`
   - Set `FLASK_ENV=production` in `.env`
   - Use strong `FLASK_SECRET_KEY`
   - Configure production database credentials

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Test Production Build Locally**
   ```bash
   npm run preview
   ```

4. **Database Setup**
   - Set up production MySQL database
   - Import schema: `egrowtifydb.sql`
   - Update database credentials in `.env`

5. **Environment Variables**
   - All API keys configured
   - Email service configured (if using)
   - Database connection strings

---

## Option 1: Render (Recommended for Beginners)

### Backend Deployment on Render

1. **Create Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service**
   - **Name**: `egrowtify-backend`
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && pip install gunicorn
     ```
   - **Start Command**: 
     ```bash
     gunicorn -w 4 -b 0.0.0.0:$PORT main:app
     ```
   - **Instance Type**: Free tier available

4. **Environment Variables** (Add in Render Dashboard)
   ```
   FLASK_ENV=production
   FLASK_SECRET_KEY=your_strong_secret_key_here
   MYSQL_HOST=your_mysql_host
   MYSQL_USER=your_db_user
   MYSQL_PASSWORD=your_db_password
   MYSQL_DB=egrowtifydb
   OPENAI_API_KEY=your_openai_key
   OPENWEATHER_API_KEY=your_weather_key
   PLANT_ID_API_KEY=your_plant_id_key
   ```

5. **Database on Render**
   - Create a PostgreSQL database (free tier)
   - Or use external MySQL (like PlanetScale, AWS RDS)

### Frontend Deployment on Render

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect repository

2. **Configure**
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```

---

## Option 2: Railway

### Backend Deployment

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Initialize Project**
   ```bash
   railway init
   railway up
   ```

3. **Add Environment Variables**
   ```bash
   railway variables set FLASK_ENV=production
   railway variables set FLASK_SECRET_KEY=your_secret_key
   # ... add all other variables
   ```

4. **Create Railway Config** (`railway.json`)
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "gunicorn -w 4 -b 0.0.0.0:$PORT main:app",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

### Database on Railway
- Railway offers PostgreSQL (free tier)
- Or connect external MySQL

---

## Option 3: VPS (DigitalOcean, AWS EC2)

### Server Setup

1. **Create Droplet/Instance**
   - Ubuntu 22.04 LTS
   - Minimum: 2GB RAM, 1 vCPU

2. **Initial Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install Python
   sudo apt install -y python3 python3-pip python3-venv
   
   # Install MySQL
   sudo apt install -y mysql-server
   
   # Install Nginx
   sudo apt install -y nginx
   ```

3. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd eGrowtify
   ```

4. **Backend Setup**
   ```bash
   # Create virtual environment
   python3 -m venv venv
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   pip install gunicorn
   
   # Create .env file
   nano .env
   # Add all environment variables
   ```

5. **Create Gunicorn Service** (`/etc/systemd/system/egrowtify.service`)
   ```ini
   [Unit]
   Description=eGrowtify Flask App
   After=network.target

   [Service]
   User=www-data
   WorkingDirectory=/path/to/eGrowtify
   Environment="PATH=/path/to/eGrowtify/venv/bin"
   ExecStart=/path/to/eGrowtify/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 main:app

   [Install]
   WantedBy=multi-user.target
   ```

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable egrowtify
   sudo systemctl start egrowtify
   ```

6. **Frontend Build**
   ```bash
   npm install
   npm run build
   ```

7. **Nginx Configuration** (`/etc/nginx/sites-available/egrowtify`)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Frontend
       root /path/to/eGrowtify/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Static files
       location /uploads {
           alias /path/to/eGrowtify/uploads;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/egrowtify /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Option 4: Docker Deployment

### Create Dockerfile

**Backend Dockerfile**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy application
COPY . .

# Expose port
EXPOSE 5000

# Run with gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "main:app"]
```

**Frontend Dockerfile**:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: egrowtifydb
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - MYSQL_HOST=db
      - MYSQL_USER=root
      - MYSQL_PASSWORD=rootpassword
      - MYSQL_DB=egrowtifydb
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

---

## Frontend Deployment (Vercel/Netlify)

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url.com`

4. **Create `vercel.json`**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

### Netlify Deployment

1. **Create `netlify.toml`**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## Important Production Updates

### Update CORS Configuration

**In `main.py`**:
```python
CORS(app, origins=['https://your-frontend-domain.com'], supports_credentials=True)
```

**In `website/__init__.py`**:
```python
CORS(app, origins=['https://your-frontend-domain.com'], supports_credentials=True)
```

### Update API URLs in Frontend

Create `src/config.js`:
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

Update all axios calls to use `API_URL`.

---

## Database Options

1. **PlanetScale** (MySQL, free tier)
2. **AWS RDS** (MySQL/PostgreSQL)
3. **Render PostgreSQL** (Free tier)
4. **Railway PostgreSQL** (Free tier)
5. **Self-hosted MySQL** (On VPS)

---

## Monitoring & Maintenance

1. **Set up logging**
2. **Monitor errors** (Sentry, LogRocket)
3. **Backup database regularly**
4. **Set up CI/CD** (GitHub Actions)
5. **Monitor API usage** (OpenAI, Weather API)

---

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Update CORS origins in backend
   - Check frontend API URL

2. **Database Connection**
   - Verify credentials
   - Check firewall rules
   - Ensure database is accessible

3. **Static Files Not Loading**
   - Check Nginx configuration
   - Verify file permissions
   - Check uploads directory path

---

## Need Help?

- Check logs: `journalctl -u egrowtify -f` (systemd)
- Check Nginx logs: `/var/log/nginx/error.log`
- Check application logs in deployment platform

