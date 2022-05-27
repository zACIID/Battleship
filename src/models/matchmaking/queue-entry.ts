import { Document, Schema, SchemaTypes, Types } from 'mongoose';
import mongoose from "mongoose";

/**
 * Interface that represent the stats of some user of the system.
 */
export interface QueueEntry {
    userId: Types.ObjectId;
    elo: number;
    queuedSince: Date
}

/**
 * Interface that represent an entry of a MatchmakingQueue collection.
 * Such entry is uniquely identified by userId, which means
 * that a user can't have more than one entry.
 */
export interface QueueEntryDocument extends QueueEntry, Document {
}

export const QueueEntrySchema = new Schema<QueueEntryDocument>(
    {
        userId: {
            type: SchemaTypes.ObjectId,
            required: [true, 'User id is required'],
            unique: true
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

// A MatchmakingQueue is a collection of QueueEntry documents
export const MatchmakingQueueModel = mongoose.model(
  'MatchmakingQueue',
  QueueEntrySchema,
  'MatchmakingQueue'
);
