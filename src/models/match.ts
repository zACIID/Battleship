import * as mongoose from 'mongoose';
import {Document, Model, Schema, Types, SchemaTypes} from 'mongoose';
import {ChatModel, ChatDocument} from './chat';

/**
 * Interface that represent a stats sub-document found in a Match document.
 *
 */
export interface MatchStats {
    winner: Types.ObjectId;
    start_time: Date;
    end_time: Date;
    total_shots: number;
    ships_destroyed: number;
}

export const MatchStatsSchema = new Schema<MatchStats>({
    winner: {
        type: SchemaTypes.ObjectId,
    },
    start_time: {
        type: SchemaTypes.Date,
        required: true,
    },
    end_time: {
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

/**
 * Interface that represents a Match document.
 * Such document represents a match between two players and the two types
 * of chatroom that such match supports.
 */
export interface MatchDocument extends Document {
    player_1: Types.ObjectId;
    player_2: Types.ObjectId;
    players_chat: ChatDocument;
    observers_chat: ChatDocument;
    stats: MatchStats;
}

export const MatchSchema = new Schema<MatchDocument>({
    player_1: SchemaTypes.ObjectId,

    player_2: SchemaTypes.ObjectId,

    players_chat: ChatModel,

    observers_chat: ChatModel,

    stats: MatchStatsSchema,
});

export const MatchModel: Model<MatchDocument> = mongoose.model('Match', MatchSchema, 'matches');
