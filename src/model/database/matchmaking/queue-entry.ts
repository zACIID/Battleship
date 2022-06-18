import { AnyKeys, Document, Schema, SchemaTypes, Types } from 'mongoose';
import mongoose from 'mongoose';
import { getUserById, UserDocument } from '../user/user';
import { DeletionResult } from '../../../routes/utils/mongoose';

/**
 * Interface that represent the stats of some user of the system.
 */
export interface QueueEntry {
    userId: Types.ObjectId;
    elo: number;
    queuedSince: Date;
}

/**
 * Interface that represent an entry of a MatchmakingQueue collection.
 * Such entry is uniquely identified by userId, which means
 * that a user can't have more than one entry.
 */
export interface QueueEntryDocument extends QueueEntry, Document {}

export const QueueEntrySchema = new Schema<QueueEntryDocument>({
    userId: {
        type: SchemaTypes.ObjectId,
        required: [true, 'User id is required'],
        index: true,
        unique: true,
    },
    elo: {
        type: SchemaTypes.Number,
        required: [true, 'Elo is required'],
    },
    queuedSince: {
        type: SchemaTypes.Date,
        default: () => new Date(),
    },
});

// A MatchmakingQueue is a collection of QueueEntry documents
export const MatchmakingQueueModel = mongoose.model(
    'MatchmakingQueue',
    QueueEntrySchema,
    'MatchmakingQueue'
);

/**
 * Insert an entry in the matchmaking queue for the specified user
 * @param userId
 */
export const insertMatchmakingEntry = async (userId: Types.ObjectId): Promise<void> => {
    const playerToQueue: UserDocument = await getUserById(userId);
    const queueEntry: AnyKeys<QueueEntry> = {
        userId: playerToQueue._id,
        elo: playerToQueue.stats.elo,
    };

    const queueDoc: QueueEntryDocument = new MatchmakingQueueModel(queueEntry);
    await queueDoc.save();
};

/**
 * Removes the user with the specified id from the queue.
 * @param userId
 */
export const removeMatchmakingEntry = async (userId: Types.ObjectId): Promise<void> => {
    const result: DeletionResult = await MatchmakingQueueModel.deleteOne({ userId: userId });

    if (result.deletedCount === 0) {
        throw new Error(`User ${userId} not found in the matchmaking queue`);
    }
};
