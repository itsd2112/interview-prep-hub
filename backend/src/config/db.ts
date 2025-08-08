import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedData } from '../data/enhanced-seeder';

dotenv.config();

const getMongoURI = (): string => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('❌ MONGO_URI is not defined in environment variables');
        console.log('Please check your .env file or Render environment variables');
        process.exit(1);
    }
    return uri;
};

const connectDb = async (): Promise<void> => {
    const mongoURI = getMongoURI();
    
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log('✅ MongoDB Connected!');
        
        // Seed the database with initial data
        try {
            await seedData();
            console.log('✅ Database seeded successfully!');
        } catch (seedError) {
            console.error('❌ Error seeding database:', seedError);
            // Don't exit the process if seeding fails, as the app might still work with existing data
        }
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

export default connectDb;