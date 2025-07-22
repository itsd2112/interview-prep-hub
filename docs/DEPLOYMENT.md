# Deployment Guide

## Overview

This guide covers deployment options for the Interview Prep Hub application across different environments.

## Prerequisites

- Node.js 18+ 
- MongoDB instance (local or cloud)
- Git
- Domain name (for production)

## Environment Variables

### Backend (.env)

```env
# Database
MONGO_URI=mongodb://localhost:27017/interview-prep-hub

# Server
PORT=8080
NODE_ENV=production

# Optional: MongoDB Cloud
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-prep-hub
```

### Frontend (environment.ts)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api'
};
```

## Local Development

### Quick Start

1. **Clone and setup:**
```bash
git clone <repository-url>
cd interview-prep-hub
```

2. **Backend setup:**
```bash
cd backend
npm install
cp .env.example .env  # Configure your MongoDB URI
npm run dev
```

3. **Frontend setup:**
```bash
cd frontend
npm install
npm start
```

4. **Access application:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080

## Production Deployment

### Option 1: Traditional VPS/Server

#### Backend Deployment

1. **Server setup:**
```bash
# Install Node.js and MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb

# Clone repository
git clone <repository-url>
cd interview-prep-hub/backend
```

2. **Install dependencies and build:**
```bash
npm install
npm run build
```

3. **Configure environment:**
```bash
# Create production .env
nano .env
```

4. **Start with PM2:**
```bash
npm install -g pm2
pm2 start dist/app.js --name "interview-prep-api"
pm2 startup
pm2 save
```

5. **Setup reverse proxy (Nginx):**
```nginx
server {
    listen 80;
    server_name your-api-domain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Frontend Deployment

1. **Build for production:**
```bash
cd frontend
npm install
npm run build
```

2. **Serve with Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/interview-prep-hub/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option 2: Docker Deployment

#### Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
```

#### Frontend Dockerfile

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
```

#### Docker Compose

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: interview-prep-hub

  backend:
    build: ./backend
    restart: always
    ports:
      - "8080:8080"
    environment:
      MONGO_URI: mongodb://mongodb:27017/interview-prep-hub
      NODE_ENV: production
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Option 3: Cloud Platform Deployment

#### Heroku

**Backend (Heroku):**

1. **Create Heroku app:**
```bash
heroku create interview-prep-api
```

2. **Add MongoDB addon:**
```bash
heroku addons:create mongolab:sandbox
```

3. **Deploy:**
```bash
git subtree push --prefix backend heroku main
```

**Frontend (Netlify/Vercel):**

1. **Build command:** `npm run build`
2. **Publish directory:** `dist`
3. **Environment variables:** Set API_URL to your Heroku backend

#### AWS/Azure/GCP

- Use their respective container services (ECS, Container Instances, Cloud Run)
- Configure managed databases (DocumentDB, CosmosDB, Cloud Firestore)
- Set up load balancers and CDN for frontend

## Database Setup

### MongoDB Atlas (Cloud)

1. **Create cluster** at mongodb.com
2. **Configure network access** (whitelist IPs)
3. **Create database user**
4. **Get connection string:**
```
mongodb+srv://username:password@cluster.mongodb.net/interview-prep-hub
```

### Local MongoDB

```bash
# Install MongoDB
sudo apt-get install mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database
mongo
> use interview-prep-hub
> db.createCollection("questions")
```

## Security Considerations

### Backend Security

1. **Environment variables:**
   - Never commit `.env` files
   - Use secure secret management in production

2. **CORS configuration:**
```typescript
app.use(cors({
  origin: ['https://your-domain.com'],
  credentials: true
}));
```

3. **Rate limiting:**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api', limiter);
```

### Frontend Security

1. **Environment-specific builds**
2. **HTTPS enforcement**
3. **Content Security Policy headers**

## Monitoring & Maintenance

### Health Checks

**Backend health endpoint:**
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Backup Strategy

1. **Database backups:**
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/interview-prep-hub" --out=/backup/
```

2. **Application backups:**
   - Version control with Git
   - Regular code repository backups

## Troubleshooting

### Common Issues

1. **CORS errors:**
   - Check frontend API URL configuration
   - Verify backend CORS settings

2. **Database connection:**
   - Verify MongoDB URI
   - Check network connectivity
   - Confirm database credentials

3. **Build failures:**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify TypeScript configuration

### Performance Optimization

1. **Backend:**
   - Enable gzip compression
   - Implement caching strategies
   - Database indexing

2. **Frontend:**
   - Enable Angular production mode
   - Implement lazy loading
   - Optimize bundle size
