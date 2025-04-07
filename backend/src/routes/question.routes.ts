import express from 'express';
import { getCategories, getQuestionsByCategory} from '../controllers/question.controller';

const router = express.Router();

router.get('/categories', async(req, res) => {
    const result = await getCategories(req, res);
    res.json(result);
});

router.get('/questions/:category', getQuestionsByCategory);

export default router;

