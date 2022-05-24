import * as mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import { UserDocument, getUserById, createUser, deleteUser, UserRoles } from '../models/user';
import { authenticateToken, retrieveUserId } from './auth-routes';
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
                const newMod: UserDocument = await createUser(req.body.user);
                await newMod.setRole(UserRoles.Moderator);

                return res.status(200).json(newMod);
            } else
                return res.status(403).json({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    errorMessage: 'Unauthorized',
                    requestPath: req.path,
                });
        } catch (err) {
            return res.status(500).json({ error: true, errormessage: err.message });
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
        let moderator: UserDocument;
        const userId: Types.ObjectId = res.locals.userId;
        try {
            moderator = await getUserById(userId);
            if (moderator.isModerator || moderator.isAdmin) {
                await deleteUser(req.body.userId);
            } else
                res.status(403).json({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    errorMessage: `Unauthorized: user ${userId} is not a moderator`,
                    requestPath: req.path,
                });
        } catch (err) {
            return res.status(404).json({ error: true, errormessage: err.message });
        }

        return res.status(200).json();
    }
);
