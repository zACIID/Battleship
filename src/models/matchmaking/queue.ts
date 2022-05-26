import { Document, Schema, SchemaTypes, Types } from 'mongoose';
import { QueueEntry, QueueEntrySchema, QueueEntrySubDocument } from './queue-entry';
import * as mongoose from 'mongoose';

/**
 * Interface that represent a matchmaking queue
 */
export interface MatchmakingQueue {
    queue: QueueEntry[];
}

/**
 * Interface that represent the document of a matchmaking queue
 */
export interface MatchmakingQueueDocument extends MatchmakingQueue, Document {
    queue: QueueEntrySubDocument[];
}

export const MatchmakingQueueSchema = new Schema<MatchmakingQueueDocument>({
    queue: {
        type: [QueueEntrySchema],
        default: [],
    },
});

export const MatchmakingQueueModel = mongoose.model(
    'MatchmakingQueue',
    MatchmakingQueueSchema,
    'MatchmakingQueues'
);
