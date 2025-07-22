# Architecture Documentation

## System Overview

Interview Prep Hub is a full-stack web application built with a modern TypeScript-based architecture, following separation of concerns and RESTful API principles.

## High-Level Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    Mongoose    ┌─────────────────┐
│                 │    Requests     │                 │      ODM       │                 │
│  Angular 19     │ ◄─────────────► │  Express.js     │ ◄────────────► │    MongoDB      │
│  Frontend       │                 │  Backend        │                │   Database      │
│                 │                 │                 │                │                 │
└─────────────────┘                 └─────────────────┘                └─────────────────┘
```

## Technology Stack

### Frontend Layer
- **Framework**: Angular 19 with standalone components
- **Language**: TypeScript 5.7
- **State Management**: Angular Signals
- **HTTP Client**: Angular HttpClient with RxJS
- **UI/UX**: Angular CDK for responsive design
- **Styling**: SCSS
- **Build Tool**: Angular CLI with Webpack

### Backend Layer
- **Runtime**: Node.js
- **Framework**: Express.js 5.1
- **Language**: TypeScript 5.8
- **API Style**: RESTful
- **Middleware**: CORS, Express JSON parser
- **Environment**: dotenv for configuration

### Data Layer
- **Database**: MongoDB
- **ODM**: Mongoose 8.13
- **Schema**: Document-based with validation
- **Connection**: Async connection with error handling

## Detailed Architecture

### Frontend Architecture

```
src/app/
├── app.component.ts          # Root component
├── app.config.ts            # Application configuration
├── app.routes.ts            # Routing configuration
├── questions/               # Feature module
│   ├── questions.component.ts    # Main questions display
│   ├── questions.component.html  # Template
│   └── questions.component.scss  # Styles
└── services/
    └── questions.service.ts      # HTTP service layer
```

**Component Hierarchy:**
```
AppComponent (Root)
└── RouterOutlet
    └── QuestionsComponent
```

**Data Flow:**
1. Component initializes and calls service
2. Service makes HTTP request to backend
3. Response data updates component signals
4. UI reactively updates based on signal changes

### Backend Architecture

```
src/
├── app.ts                   # Application entry point
├── config/
│   └── db.ts               # Database connection
├── controllers/
│   └── question.controller.ts   # Business logic
├── models/
│   └── question.model.ts       # Data models
├── routes/
│   └── question.routes.ts      # API routes
└── data/
    └── seeder.ts              # Database seeding
```

**Request Flow:**
```
HTTP Request → Express Router → Controller → Model → MongoDB
                    ↓
HTTP Response ← JSON Serialization ← Business Logic ← Data Query
```

## Design Patterns

### Frontend Patterns

1. **Component-Based Architecture**
   - Standalone components for modularity
   - Single responsibility principle

2. **Service Layer Pattern**
   - HTTP services for API communication
   - Dependency injection for loose coupling

3. **Reactive Programming**
   - RxJS Observables for async operations
   - Angular Signals for state management

4. **Responsive Design Pattern**
   - Breakpoint observer for device detection
   - Mobile-first approach

### Backend Patterns

1. **MVC (Model-View-Controller)**
   - Models: Data structure and validation
   - Controllers: Business logic and request handling
   - Routes: URL mapping and middleware

2. **Repository Pattern** (via Mongoose)
   - Data access abstraction
   - Query optimization

3. **Middleware Pattern**
   - CORS handling
   - JSON parsing
   - Error handling

4. **Configuration Pattern**
   - Environment-based configuration
   - Centralized database connection

## Data Models

### Question Schema
```typescript
interface Question {
  _id: ObjectId;           // Primary key
  question: string;        // Required field
  answer: string;          // Required field
  category: string;        // Required field for grouping
  tags: string[];          // Optional metadata
  __v: number;            // Version key
}
```

### Database Indexes
```javascript
// Recommended indexes for performance
db.questions.createIndex({ "category": 1 })
db.questions.createIndex({ "tags": 1 })
db.questions.createIndex({ "category": 1, "tags": 1 })
```

## API Design

### RESTful Principles
- **Resource-based URLs**: `/api/questions`, `/api/categories`
- **HTTP methods**: GET for data retrieval
- **Status codes**: 200 (success), 500 (error)
- **JSON format**: Consistent response structure

### Endpoint Design
```
GET /api/categories
├── Returns: Array of category strings
└── Use case: Populate category filters

GET /api/questions/:category
├── Parameters: category (string)
├── Returns: Array of Question objects
└── Use case: Display filtered questions
```

## Security Architecture

### Current Implementation
- **CORS**: Enabled for cross-origin requests
- **Input validation**: Mongoose schema validation
- **Error handling**: Generic error responses

### Recommended Enhancements
```typescript
// Rate limiting
import rateLimit from 'express-rate-limit';

// Input sanitization
import mongoSanitize from 'express-mongo-sanitize';

// Security headers
import helmet from 'helmet';
```

## Performance Considerations

### Frontend Optimization
- **Lazy loading**: Route-based code splitting
- **Change detection**: OnPush strategy for components
- **Bundle optimization**: Tree shaking and minification
- **Caching**: HTTP interceptors for response caching

### Backend Optimization
- **Database indexing**: Category and tag indexes
- **Connection pooling**: Mongoose default pooling
- **Response compression**: Gzip middleware
- **Query optimization**: Efficient MongoDB queries

## Scalability Architecture

### Horizontal Scaling Options
```
Load Balancer
├── Frontend Instance 1 (CDN)
├── Frontend Instance 2 (CDN)
└── Frontend Instance N (CDN)

API Gateway
├── Backend Instance 1
├── Backend Instance 2
└── Backend Instance N
        ↓
MongoDB Cluster (Replica Set)
```

### Microservices Evolution
```
Current Monolith → Future Microservices
├── Question Service
├── Category Service
├── User Service (future)
└── Analytics Service (future)
```

## Development Architecture

### Build Pipeline
```
Source Code → TypeScript Compilation → Testing → Building → Deployment
```

### Development Tools
- **Frontend**: Angular CLI, TypeScript compiler
- **Backend**: ts-node, nodemon for development
- **Database**: MongoDB Compass for management
- **Version Control**: Git with conventional commits

## Deployment Architecture

### Development Environment
```
localhost:4200 (Angular Dev Server)
        ↓ HTTP
localhost:8080 (Express Server)
        ↓ MongoDB
localhost:27017 (Local MongoDB)
```

### Production Environment
```
CDN/Static Hosting (Frontend)
        ↓ HTTPS
Load Balancer → API Servers (Backend)
        ↓ Encrypted Connection
MongoDB Atlas/Cloud Database
```

## Error Handling Strategy

### Frontend Error Handling
```typescript
// HTTP error interceptor
catchError((error: HttpErrorResponse) => {
  console.error('API Error:', error);
  return throwError(() => error);
})
```

### Backend Error Handling
```typescript
// Global error middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Server Error' });
});
```

## Future Architecture Considerations

### Planned Enhancements
1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control

2. **Real-time Features**
   - WebSocket integration
   - Live question updates

3. **Caching Layer**
   - Redis for session management
   - API response caching

4. **Monitoring & Observability**
   - Application performance monitoring
   - Centralized logging
   - Health check endpoints

This architecture provides a solid foundation for a scalable, maintainable interview preparation platform while following modern web development best practices.
