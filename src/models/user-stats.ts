import { Schema, SchemaTypes } from 'mongoose';

/**
 * Interface that represent the stats of some user of the system.
 */
export interface UserStats {
    elo: number;
    topElo: number;
    wins: number;
    losses: number;
    shipsDestroyed: number;
    totalShots: number;
    hits: number;
}

export const StatsSchema = new Schema<UserStats>({
    elo: {
        type: SchemaTypes.Number,
        default: 0,
        index: true,
    },
    topElo: {
        type: SchemaTypes.Number,
        default: 0,
    },
    wins: {
        type: SchemaTypes.Number,
        default: 0,
    },
    losses: {
        type: SchemaTypes.Number,
        default: 0,
    },
    shipsDestroyed: {
        type: SchemaTypes.Number,
        default: 0,
    },
    totalShots: {
        type: SchemaTypes.Number,
        default: 0,
    },
    totalHits: {
        type: SchemaTypes.Number,
        default: 0,
    },
});
