import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import connectDb from './config/db';
import questionRoutes from './routes/question.routes';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Interview Prep Hub API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', questionRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
    path: req.path
  });
});

// Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDb();
    console.log('✅ Connected to MongoDB');
    
    // Start the server
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
      console.error('❌ Unhandled Rejection:', err);
      server.close(() => process.exit(1));
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();