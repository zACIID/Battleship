import { Response, Router } from 'express';
import { Types } from 'mongoose';

import { authenticateToken } from './auth-routes';
import { retrieveUserId } from './utils/param-checking';
import {
    insertMatchmakingEntry,
    removeMatchmakingEntry,
} from '../model/database/matchmaking/queue-entry';
import { setUserStatus, UserStatus } from '../model/database/user/user';
import { AuthenticatedRequest } from './utils/authenticated-request';
import { ioServer } from '../index';

export const router = Router();

interface EnqueueRequestBody {
    userId: string;
}

interface EnqueueRequest extends AuthenticatedRequest {
    body: EnqueueRequestBody;
}

/**
 * /api/matchmaking/queue   POST   Add a user to the matchmaking queue
 */
router.post('/matchmaking/queue', authenticateToken, async (req: EnqueueRequest, res: Response) => {
    try {
        const { userId } = req.body;
        const userObjId: Types.ObjectId = Types.ObjectId(userId);
        await insertMatchmakingEntry(userObjId);

        // Change the status of the user: he is now queued
        await setUserStatus(ioServer, userObjId, UserStatus.InQueue);

        return res.status(201).json(req.body);
    } catch (err) {
        return res.status(400).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
});

interface RemoveFromQueueRequestLocals {
    userId: Types.ObjectId;
}

interface RemoveFromQueueRequest extends AuthenticatedRequest {
    locals: RemoveFromQueueRequestLocals;
}

/**
 * /api/matchmaking/queue/:userId  DELETE  Remove the user with the specified id from the matchmaking queue
 */
router.delete(
    '/matchmaking/queue/:userId',
    authenticateToken,
    retrieveUserId,
    async (req: RemoveFromQueueRequest, res: Response) => {
        try {
            const userIdToUnQueue: Types.ObjectId = res.locals.userId;
            await removeMatchmakingEntry(userIdToUnQueue);

            // The user is not in queue anymore, so it goes back to idle (Online)
            await setUserStatus(ioServer, userIdToUnQueue, UserStatus.Online);

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
