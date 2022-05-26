import { Router, Request, Response } from 'express';
import { getLeaderboard, UserDocument } from '../models/user/user';
import { authenticateToken } from './auth-routes';

export const router = Router();


router.post('/matchmaking/queue',
            authenticateToken,
            async (req: Request, res: Response) => {
    try {
        throw new Error("Not Implemented");

        return res.status(200).json();
    }
    catch (err) {
        return res.status(400).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
});


router.delete('/matchmaking/queue', authenticateToken, async (req: Request, res: Response) => {
    try {
        throw new Error("Not Implemented");

        return res.status(200).json();
    }
    catch (err) {
        return res.status(400).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
});
