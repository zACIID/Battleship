import {
    updatePassword,
    updateUserName,
    getUsers,
    updateUserStats,
} from '../models/user';
import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';
import {
    UserDocument,
    getUserById,
    deleteUser,
    getUserStats,
} from '../models/user';
import { UserStats } from '../models/user-stats';
import { authenticateToken, retrieveUserId } from './auth-routes';

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
    result: boolean;
    shipsDestroyed: number;
    hits: number;
    shots: number;
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


router.get('/users/:userId', authenticateToken, retrieveUserId, async (req: Request, res: Response) => {
    let user: UserDocument;
    const userId: Types.ObjectId = res.locals.userId;
    try {
        
        user = await getUserById(userId);
    } catch (err) {
        const statusCode: number = err.message === userErr ? 404 : 500;
        return res.status(statusCode).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
    return res.status(201).json({
        "userId": user._id,
        "username": user.username,
        "roles":user.roles,
        "online": user.online
    });
});

router.patch(
    '/users/:userId/username',
    authenticateToken,
    retrieveUserId, 
    async (req: PatchUsernameRequest, res: Response) => {
        const { username } = req.body;
        const userId: Types.ObjectId = res.locals.userId;
        try{
            await updateUserName(userId, username);
            res.status(200).json( username );
        }catch(err){
            const statusCode: number = err.message === userErr ? 404 : 500;
            res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

router.patch(
    '/users/:userId/password',
    authenticateToken,
    retrieveUserId,
    async (req: PatchPasswordRequest, res: Response) => {
        const { password } = req.body;
        const userId: Types.ObjectId = res.locals.userId;
        
        try{
            await updatePassword(userId, password);
            res.sendStatus(204);
        }catch(err){
            const statusCode: number = err.message === userErr ? 404 : 500;
            res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }

    }
);

router.delete('/users/:userId', authenticateToken, retrieveUserId, async (req: Request, res: Response) => {
    const userId: Types.ObjectId = res.locals.userId;
    await deleteUser(userId).catch((err) => {
        const statusCode: number = err.message === userErr ? 404 : 500;
        res.status(statusCode).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    });

    res.status(204).json({});
});

router.get('/users/:userId/stats', authenticateToken, retrieveUserId, async (req: Request, res: Response) => {
    const userId: Types.ObjectId = res.locals.userId;
    let stats: UserStats;
    try {
        stats = await getUserStats(userId);
        res.status(200).json({ stats });
    } catch (err) {
        const statusCode: number = err.message === userErr ? 404 : 500;
        res.status(statusCode).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
    
});

router.patch(
    '/users/:userId/stats',
    authenticateToken,
    retrieveUserId,
    async (req: PatchStatsRequest, res: Response) => {
        const userId: Types.ObjectId = res.locals.userId;
        const { elo, result, shipsDestroyed, shots, hits } = req.body;
        
        try{
            await updateUserStats(userId, elo, result, shipsDestroyed, shots, hits);
            res.status(200).json({ elo, result, shipsDestroyed, shots, hits });
        }
        catch(err){
            const statusCode: number = err.message === userErr ? 404 : 500;
            res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }

    }
);

router.post('/users', authenticateToken, async (req: GetMultipleUsersRequest, res: Response) => {
    let users: UserDocument[];
    try {
        // If there is no "ids" query param, an exception is thrown and a 404 error is appropriate
        const userIdsQParam: string[] = (req.query.ids as string).split(",");
        const userObjIds: Types.ObjectId[] = userIdsQParam.map((uId) => {
            return Types.ObjectId(uId);
        })
        users = await getUsers(userObjIds);
    } catch (err) {
        let statusCode: number = 404;
        if (err instanceof Error && err.message === usersErr) statusCode = 500;
        else {
            res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
        res.status(statusCode).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
    const results = users.map((x: UserDocument) => {return{userId: x._id, username: x.username, roles: x.roles, online: x.online}} )
    res.status(200).json({users: results});
});
