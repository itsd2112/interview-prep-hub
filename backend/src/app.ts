import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db';

dotenv.config();

connectDb();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.end("hello")
});

// Sample Questions Data
const questions = [
  { id: 1, question: "What is Node.js?", answer: "Node.js is a runtime..." },
  { id: 2, question: "What is TypeScript?", answer: "TypeScript is a superset of JavaScript..." }
];

app.get('/api/questions', (req, res) => {
  res.json(questions);
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})