import { updatePassword, updateUserName, getUsers, updateUserStats } from '../models/user';
import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';
import { UserDocument, getUserById, deleteUser, getUserStats } from '../models/user';
import { UserStats } from '../models/user-stats';
import { authenticateToken, retrieveUserId, retrieveId } from './auth-routes';
import { stat } from 'fs';

interface UserEndpointLocals {
    userId: Types.ObjectId;
}

interface UserEndpointResponse extends Response {
    locals: UserEndpointLocals
}

interface PatchUsernameBody {
    username: string;
}

interface PatchPasswordBody {
    password: string;
}

interface GetMultipleUsersBody {
    userIds: Types.ObjectId[];
}

interface PatchStatsBody {
    elo: number;
    topElo: number;
    wins: number;
    losses: number;
    shipsDestroyed: number;
    totalHits: number;
    totalShots: number;
}

interface GetMultipleUsersRequest extends Request {
    body: GetMultipleUsersBody;
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

export const router = Router();
const userErr: string = 'No user with that identifier';
const usersErr: string = 'None of the given ids are present in the db';

router.get(
    '/users/:userId',
    authenticateToken,
    retrieveUserId,
    async (req: Request, res: UserEndpointResponse) => {
        let user: UserDocument;
        const userId: Types.ObjectId = res.locals.userId;
        try {
            user = await getUserById(userId);
            return res.status(201).json({
                userId: user._id,
                username: user.username,
                roles: user.roles,
                online: user.online,
            });
        } catch (err) {
            const statusCode: number = err.message === userErr ? 404 : 500;
            return res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

router.put(
    '/users/:userId/username',
    authenticateToken,
    retrieveUserId,
    async (req: PatchUsernameRequest, res: UserEndpointResponse) => {
        const { username } = req.body;

        const userId: Types.ObjectId = res.locals.userId;

        if (username) {
            try {
                await updateUserName(userId, username);
                return res.status(200).json({ username });
            } catch (err) {
                const statusCode: number = err.message === userErr ? 404 : 500;
                return res.status(statusCode).json({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    errorMessage: err.message,
                    requestPath: req.path,
                });
            }
        } else {
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: 'Wrong parameters',
                requestPath: req.path,
            });
        }
    }
);

router.put(
    '/users/:userId/password',
    authenticateToken,
    retrieveUserId,
    async (req: PatchPasswordRequest, res: UserEndpointResponse) => {
        const { password } = req.body;
        const userId: Types.ObjectId = res.locals.userId;
        if (password) {
            try {
                await updatePassword(userId, password);
                return res.sendStatus(204);
            } catch (err) {
                const statusCode: number = err.message === userErr ? 404 : 500;
                return res.status(statusCode).json({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    errorMessage: err.message,
                    requestPath: req.path,
                });
            }
        } else {
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: 'Wrong parameters',
                requestPath: req.path,
            });
        }
    }
);

router.delete(
    '/users/:userId',
    authenticateToken,
    retrieveUserId,
    async (req: Request, res: UserEndpointResponse) => {
        const userId: Types.ObjectId = res.locals.userId;

        try {
            await deleteUser(userId);
            return res.status(204).json();
        } catch (err) {
            const statusCode: number = err.message === userErr ? 404 : 500;
            return res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

router.get(
    '/users/:userId/stats',
    authenticateToken,
    retrieveUserId,
    async (req: Request, res: UserEndpointResponse) => {
        const userId: Types.ObjectId = res.locals.userId;
        let stats: UserStats;
        try {
            stats = await getUserStats(userId);
            return res.status(200).json({
                elo: stats.elo,
                topElo: stats.topElo,
                wins: stats.wins,
                losses: stats.losses,
                shipsDestroyed: stats.shipsDestroyed,
                totalShots: stats.totalShots,
                totalHits: stats.totalHits,
            });
        } catch (err) {
            const statusCode: number = err.message === userErr ? 404 : 500;
            return res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

router.put(
    '/users/:userId/stats',
    authenticateToken,
    retrieveUserId,
    async (req: PatchStatsRequest, res: UserEndpointResponse) => {
        const userId: Types.ObjectId = res.locals.userId;
        const { elo, topElo, wins, losses, shipsDestroyed, totalShots, totalHits } = req.body;
        console.log('DA ROUTES');
        console.log('elo ' + elo);
        console.log('topelo' + topElo);
        console.log('wins + losses' + ' :' + wins + ' :' + losses);
        console.log('shipsDestroyed ' + shipsDestroyed);
        console.log('shots ' + totalShots);
        console.log('hits ' + totalHits);

        try {
            await updateUserStats(
                userId,
                elo,
                topElo,
                wins,
                losses,
                shipsDestroyed,
                totalShots,
                totalHits
            );
            return res
                .status(200)
                .json({ elo, topElo, wins, losses, shipsDestroyed, totalShots, totalHits });
        } catch (err) {
            console.log('MESSAGGIO ERRORE   ' + err.message);
            const statusCode: number = err.message === userErr ? 404 : 500;
            return res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

router.get('/users', authenticateToken, async (req: GetMultipleUsersRequest, res: UserEndpointResponse) => {
    let users: UserDocument[];

    try {
        const userIdsQParam: string[] = (req.query.ids as string).split(',');
        const userObjIds: Types.ObjectId[] = userIdsQParam.map((uId) => {
            return retrieveId(uId);
        });

        users = await getUsers(userObjIds);
        const results = users.map((x: UserDocument) => {
            return {
                userId: x._id,
                username: x.username,
                roles: x.roles,
                online: x.online,
            };
        });

        return res.status(200).json({ users: results });
    } catch (err) {
        let statusCode: number = 404;
        if (err instanceof Error && err.message === usersErr) {
            statusCode = 500;
        } else {
            return res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }

        return res.status(statusCode).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
});
