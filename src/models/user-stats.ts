import { Schema, SchemaTypes, Types } from 'mongoose';

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
    totalHits: number;
}

/**
 * Interface that represent a stats sub-document in the user document
 */
export interface UserStatsSubDocument extends UserStats, Types.EmbeddedDocument {}

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
