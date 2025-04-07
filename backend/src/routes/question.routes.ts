import express from 'express';
import { getCategories } from '../controllers/question.controller';

const router = express.Router();

router.get('/categories', async(req, res) => {
    const result = await getCategories(req, res);
    res.json(result);
});

export default router;

