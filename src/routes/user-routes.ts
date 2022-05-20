import * as express from 'express';
import {
    updatePassword,
    UserModel,
    updateUserName,
    getUsers,
    updateUserStats,
} from '../models/user';
import { Router, Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import {
    getLeaderboard,
    UserDocument,
    getUserById,
    deleteUser,
    getUserStats,
} from '../models/user';
import { UserStats } from '../models/user-stats';
import { authenticateToken } from './auth-routes';
import * as mongoose from 'mongoose';

interface PatchUsernameBody {
    username: string;
}

interface PatchPasswordBody {
    password: string;
}

interface GetUsersBody {
    userIds: Types.ObjectId[];
}

interface PatchStatsBody {
    elo: number;
    result: boolean;
    shipsDestroyed: number;
    hits: number;
    shots: number;
}

interface GetUsersRequest extends Request {
    body: GetUsersBody;
}

interface PatchUsernameRequest extends Request {
    body: PatchUsernameBody;
}

interface PatchPasswordRequest extends Request {
    body: PatchPasswordBody;
}

interface PatchStatsRequest extends Request {
    body: PatchStatsBody;
}

const router = Router();
const userErr: string = 'No user with that identifier';
const usersErr: string = 'None of the given ids are present in the db';

router.get('/users/:userId', authenticateToken, async (req: Request, res: Response) => {
    let user: UserDocument;
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    try {
        user = await getUserById(userId);
    } catch (err) {
        const statusCode: number = err.message === userErr ? 404 : 500;
        res.status(statusCode).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
    res.send(200).json({ user });
});

router.patch(
    '/users/:userId/username',
    authenticateToken,
    async (req: PatchUsernameRequest, res: Response) => {
        const { username } = req.body;
        const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
        await updateUserName(userId, username).catch((err) => {
            const statusCode: number = err.message === userErr ? 404 : 500;
            res.status(statusCode).json({
                timestamp: 1651881600, // Unix seconds timestamp
                errorMessage: 'some error message',
                requestPath: 'error/request/path',
            });
        });
        res.send(200).json({ username });
    }
);

router.patch(
    '/users/:userId/password',
    authenticateToken,
    async (req: PatchPasswordRequest, res: Response) => {
        const { password } = req.body;
        const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
        await updatePassword(userId, password).catch((err) => {
            const statusCode: number = err.message === userErr ? 404 : 500;
            res.status(statusCode).json({
                timestamp: 1651881600, // Unix seconds timestamp
                errorMessage: 'some error message',
                requestPath: 'error/request/path',
            });
        });
        res.send(200).json({ password });
    }
);

router.delete('/users/:userId', authenticateToken, async (req: Request, res: Response) => {
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    await deleteUser(userId).catch((err) => {
        const statusCode: number = err.message === userErr ? 404 : 500;
        res.status(statusCode).json({
            timestamp: 1651881600, // Unix seconds timestamp
            errorMessage: 'some error message',
            requestPath: 'error/request/path',
        });
    });

    res.send(204).json({});
});

router.get('/users/:userId/stats', authenticateToken, async (req: Request, res: Response) => {
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    let stats: UserStats;
    try {
        stats = await getUserStats(userId);
    } catch (err) {
        const statusCode: number = err.message === userErr ? 404 : 500;
        res.status(statusCode).json({
            timestamp: 1651881600, // Unix seconds timestamp
            errorMessage: 'some error message',
            requestPath: 'error/request/path',
        });
    }
    res.send(200).json({ stats });
});

router.patch(
    '/users/:userId/stats',
    authenticateToken,
    async (req: PatchStatsRequest, res: Response) => {
        const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
        const { elo, result, shipsDestroyed, shots, hits } = req.body;
        await updateUserStats(userId, elo, result, shipsDestroyed, shots, hits).catch((err) => {
            const statusCode: number = err.message === userErr ? 404 : 500;
            res.status(statusCode).json({
                timestamp: 1651881600, // Unix seconds timestamp
                errorMessage: 'some error message',
                requestPath: 'error/request/path',
            });
        });
        res.send(200).json({ elo, result, shipsDestroyed, shots, hits });
    }
);

router.get('/users', authenticateToken, async (req: GetUsersRequest, res: Response) => {
    const { userIds } = req.body;
    let users: UserDocument[];
    try {
        users = await getUsers(userIds);
    } catch (err) {
        let statusCode: number = 404;
        if (err instanceof Error && err.message === usersErr) statusCode = 500;
        else {
            res.status(statusCode).json({
                foundUsers: err,
                errorMessage: 'some error message',
                requestPath: 'error/request/path',
            });
        }
        res.status(statusCode).json({
            timestamp: 1651881600, // Unix seconds timestamp
            errorMessage: 'some error message',
            requestPath: 'error/request/path',
        });
    }
    res.send(200).json({ users });
});
