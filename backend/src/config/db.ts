import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDb = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI as string);
		console.log("✅ MongoDB Connected!");
	} catch (error) {
		console.log("❌ MongoDB Connection Failed:", error);
		process.exit(1);
	}
}

export default connectDb;