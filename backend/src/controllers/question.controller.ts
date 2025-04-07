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