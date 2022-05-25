import { Message } from './../models/message';
import { Relationship } from './../models/relationship';
import * as mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import { UserDocument, getUserById } from '../models/user';
import { authenticateToken, retrieveUserId, retrieveId } from './auth-routes';
import { Types } from 'mongoose';

export const router = Router();

interface PostBody {
    friendId: string;
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
            console.log(user);
            return res.status(200).json({ relationships: user.relationships });
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
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

        try {
            let user: UserDocument = await getUserById(userId);

            const correctFriendId = retrieveId(req.body.friendId);
            await getUserById(correctFriendId);

            user = await user.addRelationship(correctFriendId);
            const rel: Relationship = user.relationships[user.relationships.length - 1];
            return res.status(201).json(rel);
        } catch (err) {
            const status = err.message === 'No user with that identifier' ? 404 : 500;
            return res.status(status).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

/**
 *   /users/:userId/relationships | DELETE | Remove a social relationship from the specified user
 */
router.delete(
    '/users/:userId/relationships/:friendId',
    authenticateToken,
    retrieveUserId,
    async (req: RelationshipRequest, res: Response) => {
        const userId: Types.ObjectId = res.locals.userId;
        const friendId: string = req.params.friendId;

        let user: UserDocument;

        try {
            user = await getUserById(userId);

            const friendObjId: Types.ObjectId = Types.ObjectId(friendId);
            await user.removeRelationship(friendObjId);

            return res.status(204).json();
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);
