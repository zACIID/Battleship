import { Router, Request, Response } from 'express';
import { getLeaderboard, UserDocument } from '../models/user';
import { authenticateToken } from './auth-routes';

export const router = Router();

router.get('/leaderboard', authenticateToken, async (req: Request, res: Response) => {
    try {
        const skip: number = req.query.skip ? parseInt(req.query.skip as string) : 0;
        const limit: number = req.query.limit ? parseInt(req.query.limit as string) : 0;

        if (limit < 0 || limit > 50 || skip < 0 || isNaN(limit) || isNaN(skip)) {
            throw new Error('Invalid query parameters');
        } else {
            const leaderBoard: UserDocument[] = await getLeaderboard(skip, limit);
            const nextPage = `${req.path}?skip=${skip + limit}&limit=${limit}`;

            const parsedLead = leaderBoard.map((x: UserDocument) => {
                return { userId: x._id, username: x.username, elo: x.stats.elo };
            });

            return res.status(200).json({ leaderboard: parsedLead, nextPage: nextPage });
        }
    } catch (err) {
        const status: number = err.message === 'Invalid query parameters' ? 400 : 500;
        return res.status(status).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
});
