import { Router, Response } from 'express';
import { Types } from 'mongoose';

import { Relationship } from '../model/database/user/relationship';
import { UserDocument, getUserById } from '../model/database/user/user';
import { authenticateToken } from './auth-routes';
import { retrieveUserId, retrieveId } from './utils/param-checking';
import { AuthenticatedRequest } from './utils/authenticated-request';

export const router = Router();

/**
 *   /users/:userId/relationships | GET | Retrieve the relationships of the specified user
 */
router.get(
    '/users/:userId/relationships',
    authenticateToken,
    retrieveUserId,
    async (req: AuthenticatedRequest, res: Response) => {
        const userId: Types.ObjectId = res.locals.userId;
        let user: UserDocument;

        try {
            user = await getUserById(userId);

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

interface RelationshipRequestBody {
    friendId: string;
}

interface RelationshipRequest extends AuthenticatedRequest {
    body: RelationshipRequestBody;
}

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

            user = await user.addRelationshipSymmetrically(correctFriendId);
            const rel: Relationship = user.relationships[user.relationships.length - 1];

            return res.status(201).json({
                friendId: rel.friendId,
                chatId: rel.chatId,
            });
        } catch (err) {
            const status = err.message === 'No user with that identifier' ? 404 : 400;
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
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId: Types.ObjectId = res.locals.userId;
            const friendId: string = req.params.friendId;

            const user: UserDocument = await getUserById(userId);

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
