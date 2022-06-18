import { Router, Response } from 'express';
import { Types } from 'mongoose';

import { authenticateToken } from './auth-routes';
import { retrieveUserId } from './utils/param-checking';
import {
    MatchmakingQueueModel,
    QueueEntry,
    QueueEntryDocument,
} from '../model/matchmaking/queue-entry';
import { getUserById, UserDocument } from '../model/user/user';
import { AuthenticatedRequest } from './utils/authenticated-request';

export const router = Router();

interface EnqueueRequestBody {
    userId: Types.ObjectId;
}

interface EnqueueRequest extends AuthenticatedRequest {
    body: EnqueueRequestBody;
}

/**
 * /api/matchmaking/queue   POST   Add a player to the matchmaking queue
 */
router.post('/matchmaking/queue', authenticateToken, async (req: EnqueueRequest, res: Response) => {
    try {
        const playerToQueue: UserDocument = await getUserById(req.body.userId);
        const queueEntry: QueueEntry = {
            userId: playerToQueue._id,
            elo: playerToQueue.stats.elo,
            queuedSince: new Date(),
        };

        const queueDoc: QueueEntryDocument = new MatchmakingQueueModel(queueEntry);
        await queueDoc.save();

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
            const userToUnQueue: Types.ObjectId = res.locals.userId;
            await removeFromMatchmakingQueue(userToUnQueue);

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

/**
 * Removes the user with the specified id from the queue.
 * @param userId
 */
export const removeFromMatchmakingQueue = async (userId: Types.ObjectId): Promise<void> => {
    const entry: QueueEntryDocument = await MatchmakingQueueModel.findOne({
        userId: userId,
    });

    // TODO doesn't deleteOne raise an exception if no user is found to delete?
    if (entry === null) {
        throw new Error('User not found in queue');
    }

    await MatchmakingQueueModel.deleteOne({ userId: userId });
};
