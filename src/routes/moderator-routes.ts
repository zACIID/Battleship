import * as mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import { UserDocument, getUserById, createUser, deleteUser } from '../models/user';
import { authenticateToken } from './auth-routes';
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
 *    /moderators/:userId   |   POST
 */
router.post('/moderators/:userId', authenticateToken, async (req: PostRequest, res: Response) => {
    let moderator: UserDocument;
    let newMod: UserDocument;
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    try {
        moderator = await getUserById(userId);
        if (moderator.isModerator || moderator.isAdmin) {
            newMod = await createUser(req.body.user);
        } else
            res.status(403).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: 'Unauthorized',
                requestPath: req.path,
            });
    } catch (err) {
        return res.status(500).json({ error: true, errormessage: err.message });
    }

    return res.status(200).json(newMod);
});

/**
 *    Check if the user is a moderator and delete a user identified by the id found in the request body
 *    /moderators/:userId   |   DELETE
 */
router.delete(
    '/moderators/:userId',
    authenticateToken,
    async (req: DeleteRequest, res: Response) => {
        let moderator: UserDocument;
        const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
        try {
            moderator = await getUserById(userId);
            if (moderator.isModerator || moderator.isAdmin) {
                await deleteUser(req.body.userId);
            } else
                res.status(403).json({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    errorMessage: 'Unauthorized',
                    requestPath: req.path,
                });
        } catch (err) {
            return res.status(404).json({ error: true, errormessage: err.message });
        }

        return res.status(200).json();
    }
);
