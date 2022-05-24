import { Router, Request, Response } from 'express';
import { getLeaderboard, UserDocument } from '../models/user';
import { authenticateToken } from './auth-routes';

export const router = Router();

router.get('/leaderboard', authenticateToken, async (req: Request, res: Response) => {
    let leaderBoard: UserDocument[];
    const skip: number = req.query.skip ? parseInt(req.query.skip as string) : 0;
    const limit: number = req.query.limit ? parseInt(req.query.limit as string) : 0;

    try {
        leaderBoard = await getLeaderboard(skip, limit);
        const nextPage = `${req.path}?skip=${skip + limit}&limit=${limit}`;
        return res.send(200).json({ leaderBoard, nextPage: nextPage });
    } catch (err) {
        return res.status(500).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
});
