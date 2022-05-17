import * as mongoose from 'mongoose';
import { Document, Model, Schema, Types, SchemaTypes } from 'mongoose';

import { Chat, ChatSchema } from './chat';
import { MatchStats, MatchStatsSchema } from "./match-stats";

export interface Match {
    player1: Types.ObjectId;
    player2: Types.ObjectId;

    // TODO Embedding o no?
    playerChat: Chat;
    observerChat: Chat;
    stats: MatchStats;
}

/**
 * Interface that represents a Match document.
 * Such document represents a match between two players and the two types
 * of chatroom that such match supports.
 */
export interface MatchDocument extends Match, Document {}

export const MatchSchema = new Schema<MatchDocument>({
    player1: SchemaTypes.ObjectId,
    player2: SchemaTypes.ObjectId,

    // TODO Embedding o no?
    playerChat: ChatSchema,
    observerChat: ChatSchema,
    stats: MatchStatsSchema,
});

export const MatchModel: Model<MatchDocument> = mongoose.model('Match', MatchSchema, 'matches');
