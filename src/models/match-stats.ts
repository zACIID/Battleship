import { Schema, SchemaTypes, Types } from 'mongoose';

/**
 * Interface that represent a stats sub-document found in a Match document.
 *
 */
export interface MatchStats {
    winner: Types.ObjectId;
    startTime: Date;
    endTime: Date;
    totalShots: number;
    shipsDestroyed: number;
}

export const MatchStatsSchema = new Schema<MatchStats>({
    winner: {
        type: SchemaTypes.ObjectId,
    },
    startTime: {
        type: SchemaTypes.Date,
        required: true,
    },
    endTime: {
        type: SchemaTypes.Date,
    },
    totalShots: {
        type: SchemaTypes.Number,
        default: 0,
    },
    shipsDestroyed: {
        type: SchemaTypes.Number,
        default: 0,
    },
});
