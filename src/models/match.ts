import * as mongoose from 'mongoose';
import { Document, Model, Schema, Types, SchemaTypes } from 'mongoose';
import { ChatDocument, ChatModel, createChat } from './chat';

import { MatchStats, MatchStatsSchema } from './match-stats';

export interface Match {
    player1: Types.ObjectId;
    player2: Types.ObjectId;

    playersChat: Types.ObjectId;
    observersChat: Types.ObjectId;
    stats: MatchStats;
}

/**
 * Interface that represents a Match document.
 * Such document represents a match between two players and the two types
 * of chatroom that such match supports.
 */
export interface MatchDocument extends Match, Document {}

export const MatchSchema = new Schema<MatchDocument>({
    player1: {
        type: SchemaTypes.ObjectId,
        required: true,
    },

    player2: {
        type: SchemaTypes.ObjectId,
        required: true,
    },

    playersChat: {
        type: SchemaTypes.ObjectId,
        required: true,
    },

    observersChat: {
        type: SchemaTypes.ObjectId,
        required: true,
    },

    stats: {
        type: MatchStatsSchema,
        default: () => ({})
    },
});

export async function getMatchById(_id: Types.ObjectId): Promise<MatchDocument> {
    const matchData = await MatchModel.findOne({ _id }).catch((err: Error) =>
        Promise.reject(new Error('No match with that id'))
    );

    return Promise.resolve(matchData);
}

export async function createMatch(
    player1: Types.ObjectId,
    player2: Types.ObjectId
): Promise<MatchDocument> {
    const playersChat: ChatDocument = await createChat([player1, player2]);
    const observersChat: ChatDocument = await createChat([]);

    // TODO fare in modo che prenda chat id invece che obj intero
    const match = new MatchModel({
        player1: player1,
        player2: player2,
        playersChat: playersChat._id,
        observersChat: observersChat._id,
        startTime: new Date(),
    });
    return match.save();
}

export async function deleteMatch(_id: Types.ObjectId): Promise<void> {
    await MatchModel.deleteOne({ _id }).catch((err: Error) =>
        Promise.reject('An error occurred: ' + err.message)
    );
    return Promise.resolve();
}

export async function updateMatchStats(
    _id: Types.ObjectId,
    winner: Types.ObjectId,
    totalShots: Number,
    shipsDestroyed: Number
): Promise<void> {
    let endTime: Date = new Date();
    let match = await MatchModel.updateOne(
        { _id },
        { winner, endTime, totalShots, shipsDestroyed }
    ).catch((err: Error) => {
        return Promise.reject(new Error('No match with that id'));
    });

    return Promise.resolve();
}

// Create "Matches" collection
export const MatchModel: Model<MatchDocument> = mongoose.model('Match', MatchSchema, 'Matches');
