import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { QuestionModel } from '../models/question.model';

dotenv.config();

const seedData = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI as string);
    
        await QuestionModel.deleteMany();
        await QuestionModel.insertMany([
            { question: "What is Angular?", answer: "Angular is a framework.", category: "Frontend", tags: ["Angular", "JavaScript"] },
            { question: "What is Node.js?", answer: "Node.js is a runtime.", category: "Backend", tags: ["Node.js", "JavaScript"] },
            { question: "What is a Binary Tree?", answer: "A binary tree is a tree where nodes have at most 2 children.", category: "Data Structures", tags: ["Tree", "Algorithms"] }
        ]);
        console.log("Data seeded;");
        process.exit();
    } catch(err) {
        console.error("❌ Seeding Failed:", err);
        process.exit(1);
    }
}

seedData();