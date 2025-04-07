import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    question: {type: String, required: true},
    answer: {type: String, required: true},
    category: {type: String, required: true},
    tags: {type: [String], default: []}
});

export const QuestionModel = mongoose.model('QuestionModel', QuestionSchema);