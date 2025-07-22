# Interview Prep Hub

A full-stack TypeScript application for managing and displaying interview questions organized by technical categories.

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Environment**: dotenv
- **CORS**: cors middleware

### Frontend
- **Framework**: Angular 19
- **Language**: TypeScript
- **UI Components**: Angular CDK
- **HTTP Client**: Angular HttpClient
- **State Management**: Angular Signals
- **Styling**: SCSS

## 📋 Features

- ✅ Category-based question organization
- ✅ RESTful API design
- ✅ Responsive UI (mobile/desktop)
- ✅ TypeScript throughout the stack
- ✅ Database seeding with sample data
- ✅ Environment-based configuration

## 🏗️ Project Structure

```
interview-prep-hub/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── data/          # Database seeding
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── app.ts         # Main application
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── questions/ # Questions component
│   │   │   ├── services/  # HTTP services
│   │   │   ├── app.component.*
│   │   │   ├── app.routes.ts
│   │   │   └── app.config.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── package.json
│   └── angular.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/interview-prep-hub
PORT=8080
```

4. Seed the database (optional):
```bash
npm run seed
```

5. Start development server:
```bash
npm run dev
```

The backend will run on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

The frontend will run on `http://localhost:4200`

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### Get All Categories
```http
GET /categories
```

**Response:**
```json
[
  "Frontend",
  "Backend", 
  "Data Structures"
]
```

#### Get Questions by Category
```http
GET /questions/:category
```

**Parameters:**
- `category` (string): The category to filter questions by

**Response:**
```json
[
  {
    "_id": "...",
    "question": "What is Angular?",
    "answer": "Angular is a framework.",
    "category": "Frontend",
    "tags": ["Angular", "JavaScript"]
  }
]
```

## 🗄️ Database Schema

### Question Model
```typescript
interface Question {
  question: string;    // Required
  answer: string;      // Required  
  category: string;    // Required
  tags: string[];      // Optional, defaults to []
}
```

## 🧩 Component Architecture

### Backend Components

- **`app.ts`**: Main Express application setup
- **`config/db.ts`**: MongoDB connection configuration
- **`models/question.model.ts`**: Mongoose schema for questions
- **`controllers/question.controller.ts`**: Business logic for question operations
- **`routes/question.routes.ts`**: API route definitions
- **`data/seeder.ts`**: Database seeding script

### Frontend Components

- **`app.component.ts`**: Root Angular component
- **`questions.component.ts`**: Main questions display component
- **`questions.service.ts`**: HTTP service for API communication
- **`app.routes.ts`**: Angular routing configuration

## 🔄 Data Flow

1. **Frontend** makes HTTP requests via `QuestionsService`
2. **Backend** receives requests through Express routes
3. **Controllers** handle business logic and database operations
4. **MongoDB** stores and retrieves question data
5. **Response** flows back through the same chain

## 🚀 Deployment

### Backend Deployment
1. Build TypeScript:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

### Frontend Deployment
1. Build for production:
```bash
npm run build
```

2. Serve the `dist/` folder using a web server

## 🧪 Development Scripts

### Backend
- `npm run dev`: Start development server with nodemon
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Start production server

### Frontend
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run unit tests
- `npm run watch`: Build and watch for changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.
