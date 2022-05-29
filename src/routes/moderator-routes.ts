import { Router, Request, Response } from 'express';
import { UserDocument, getUserById, createUser, deleteUser, UserRoles } from '../models/user/user';
import { authenticateToken } from './auth-routes';
import { retrieveUserId } from './utils/param-checking';
import { Types } from 'mongoose';

export const router = Router();

interface PostBody {
    user: UserDocument;
}

interface PostRequest extends Request {
    body: PostBody;
}

interface DeleteBody {
    userId: Types.ObjectId;
}

interface DeleteRequest extends Request {
    body: DeleteBody;
}

/**
 *    Check if the user is a moderator and create a new user using request body data
 *    /moderators/:userId/additions   |   POST
 */
router.post(
    '/moderators/:userId/additions',
    authenticateToken,
    retrieveUserId,
    async (req: PostRequest, res: Response) => {
        const userId: Types.ObjectId = res.locals.userId;
        try {
            const moderator: UserDocument = await getUserById(userId);

            if (moderator.isModerator() || moderator.isAdmin()) {
                const newMod: UserDocument = await createUser(req.body);
                await newMod.setRole(UserRoles.Moderator);

                return res.status(201).json({
                    userId: newMod._id,
                    username: newMod.username,
                    roles: newMod.roles,
                    online: newMod.online,
                });
            } else
                return res.status(403).json({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    errorMessage: `Unauthorized: user ${userId} is not a moderator`,
                    requestPath: req.path,
                });
        } catch (err) {
            const status: number = err.message === 'No user with that id' ? 404 : 500;
            return res.status(status).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

/**
 *    Check if the user is a moderator and delete a user identified by the id found in the request body
 *    /moderators/:userId/bans   |   POST
 */
router.post(
    '/moderators/:userId/bans',
    authenticateToken,
    retrieveUserId,
    async (req: DeleteRequest, res: Response) => {
        const userId: Types.ObjectId = res.locals.userId;

        try {
            const moderator: UserDocument = await getUserById(userId);

            if (moderator.isModerator() || moderator.isAdmin()) {
                await deleteUser(req.body.userId);
                return res.status(204).json();
            } else
                res.status(403).json({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    errorMessage: `Unauthorized: user ${userId} is not a moderator`,
                    requestPath: req.path,
                });
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);
