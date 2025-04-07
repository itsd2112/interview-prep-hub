import { Request, Response } from "express";
import { QuestionModel } from "../models/question.model";

export const getCategories = async (req: Request, res: Response) => {
    try{
        const categories = await QuestionModel.distinct('category');
        return categories;
    } catch(error) {
        res.status(500).json({error: 'Server Error.'})
    }
}

export const  getQuestionsByCategory = async(req: Request, res: Response) => {
    try{
        const category = req.params.category;
        const questionsByCat = await QuestionModel.find({category});
        res.json(questionsByCat);
    } catch(error) {
        res.status(500).json({error: 'Server Error.'})
    }
}