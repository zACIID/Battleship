import * as mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import { UserDocument, getUserById } from '../models/user';
import { authenticateToken, retrieveUserId } from './auth-routes';
import { Types } from 'mongoose';

export const router = Router();

interface PostBody {
    friendId: Types.ObjectId;
}

interface RelationshipRequest extends Request {
    body: PostBody;
}

/**
 *   /users/:userId/relationships | GET | Retrieve the relationships of the specified user
 */
router.get(
    '/users/:userId/relationships',
    authenticateToken,
    retrieveUserId,
    async (req: Request, res: Response) => {
        const userId: Types.ObjectId = res.locals.userId;
        let user: UserDocument;

        try {
            user = await getUserById(userId);
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }

        return res.status(200).json(user.relationships);
    }
);

/**
 *   /users/:userId/relationships | POST | Add a relationship to the specified user
 */
router.post(
    '/users/:userId/relationships',
    authenticateToken,
    retrieveUserId,
    async (req: RelationshipRequest, res: Response) => {
        const userId: Types.ObjectId = res.locals.userId;
        let user: UserDocument;

        try {
            user = await getUserById(userId);
            await user.addRelationship(req.body.friendId);
        } catch (err) {
            return res.status(500).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }

        return res.status(200).json(req.body.friendId);
    }
);

/**
 *   /users/:userId/relationships | DELETE | Remove a social relationship from the specified user
 */
router.delete(
    '/users/:userId/relationships',
    authenticateToken,
    retrieveUserId,
    async (req: RelationshipRequest, res: Response) => {
        const userId: Types.ObjectId = res.locals.userId;
        let user: UserDocument;

        try {
            user = await getUserById(userId);
            await user.removeRelationship(req.body.friendId);
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }

        return res.status(200).json();
    }
);
