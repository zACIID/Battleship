import { Document, Schema, SchemaTypes, Types } from 'mongoose';

/**
 * Interface that represent the stats of some user of the system.
 */
export interface QueueEntry {
    userId: Types.ObjectId;
    elo: number;
    queuedSince: Date
}

/**
 * Interface that represent an entry of a MatchmakingQueue collection
 */
export interface QueueEntrySubDocument extends QueueEntry, Types.EmbeddedDocument {}

export const QueueEntrySchema = new Schema<QueueEntrySubDocument>(
    {
        userId: {
            type: SchemaTypes.ObjectId,
            required: [true, 'User id is required'],
        },
        elo: {
            type: SchemaTypes.Number,
            required: [true, 'Elo is required'],
        },
        queuedSince: {
            type: SchemaTypes.Date,
            default: () => new Date()
        }
    },
    { _id: false }
);
