# API Documentation

## Overview

The Interview Prep Hub API provides endpoints for managing and retrieving interview questions organized by categories.

**Base URL:** `http://localhost:8080/api`

**Content Type:** `application/json`

## Authentication

Currently, no authentication is required for API access.

## Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success
- `404` - Resource not found
- `500` - Internal server error

Error responses follow this format:
```json
{
  "error": "Error message description"
}
```

## Endpoints

### Categories

#### Get All Categories

Retrieves all unique question categories available in the system.

**Endpoint:** `GET /categories`

**Response:**
```json
[
  "Frontend",
  "Backend",
  "Data Structures"
]
```

**Example Request:**
```bash
curl -X GET http://localhost:8080/api/categories
```

### Questions

#### Get Questions by Category

Retrieves all questions for a specific category.

**Endpoint:** `GET /questions/:category`

**Parameters:**
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| category | string | The category to filter questions by | Yes |

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "question": "What is Angular?",
    "answer": "Angular is a framework for building web applications.",
    "category": "Frontend",
    "tags": ["Angular", "JavaScript", "Framework"],
    "__v": 0
  },
  {
    "_id": "507f1f77bcf86cd799439012", 
    "question": "What is TypeScript?",
    "answer": "TypeScript is a superset of JavaScript that adds static typing.",
    "category": "Frontend",
    "tags": ["TypeScript", "JavaScript"],
    "__v": 0
  }
]
```

**Example Request:**
```bash
curl -X GET http://localhost:8080/api/questions/Frontend
```

**Example Response for Empty Category:**
```json
[]
```

## Data Models

### Question Schema

```typescript
interface Question {
  _id: ObjectId;           // MongoDB generated ID
  question: string;        // The interview question
  answer: string;          // The answer to the question
  category: string;        // Category (e.g., "Frontend", "Backend")
  tags: string[];          // Array of relevant tags
  __v: number;            // MongoDB version key
}
```

## Rate Limiting

Currently, no rate limiting is implemented.

## CORS

CORS is enabled for all origins in development. For production, configure specific origins in the backend configuration.

## Sample Data

The system comes with sample questions in the following categories:

- **Frontend**: Angular, TypeScript, JavaScript related questions
- **Backend**: Node.js, server-side development questions  
- **Data Structures**: Algorithms, data structure questions

## Development Notes

- The API uses Express.js with TypeScript
- Data is stored in MongoDB using Mongoose ODM
- Environment variables are managed with dotenv
- Development server runs with nodemon for auto-restart
