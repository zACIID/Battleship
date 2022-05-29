import * as mongoose from 'mongoose';
import { Document, Model, Schema, Types, SchemaTypes } from 'mongoose';
import { ChatDocument, ChatModel, createChat } from '../chat/chat';

import { MatchStats, MatchStatsSchema, MatchStatsSubDocument } from './match-stats';
import { PlayerState, PlayerStateSchema, PlayerStateSubDocument } from './state/player-state';
import { BattleshipGrid, BattleshipGridSubDocument } from './state/battleship-grid';
import { Shot } from './state/shot';

export interface Match {
    player1: PlayerState;
    player2: PlayerState;

    playersChat: Types.ObjectId;
    observersChat: Types.ObjectId;
    stats: MatchStats;
}

/**
 * Interface that represents a Match document.
 * Such document represents a match between two players and the two types
 * of chatroom that such match supports.
 */
export interface MatchDocument extends Match, Document {
    player1: PlayerStateSubDocument;
    player2: PlayerStateSubDocument;
    stats: MatchStatsSubDocument;

    updatePlayerGrid(playerId: Types.ObjectId, grid: BattleshipGrid): Promise<MatchDocument>;
    registerShot(shot: Shot): Promise<MatchDocument>;
}

export const MatchSchema = new Schema<MatchDocument>({
    player1: {
        type: PlayerStateSchema,
        required: true,
    },

    player2: {
        type: PlayerStateSchema,
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
        default: () => ({}),
    },
});

MatchSchema.methods.updatePlayerGrid = function (
    this: MatchDocument,
    playerId: Types.ObjectId,
    grid: BattleshipGrid
): Promise<MatchDocument> {
    if (!playerId.equals(this.player1.playerId) && !playerId.equals(this.player2.playerId)) {
        throw new Error(`Player '${playerId}' is not part of this match`);
    }

    const gridPath = playerId.equals(this.player1.playerId) ? 'player1.grid' : 'player2.grid';
    this.set(gridPath, grid);

    return this.save();
};

MatchSchema.methods.registerShot = function (
    this: MatchDocument,
    shot: Shot
): Promise<MatchDocument> {
    // The receiving player is the opposite to the one that fires the shot
    const receivingPlayer: PlayerStateSubDocument = shot.playerId.equals(this.player1.playerId)
        ? this.player2
        : this.player1;
    const receivingGrid: BattleshipGridSubDocument = receivingPlayer.grid;

    receivingGrid.shotsReceived.push(shot.coordinates);

    return this.save();
};

export async function getMatchById(matchId: Types.ObjectId): Promise<MatchDocument> {
    const matchData = await MatchModel.findOne({ _id: matchId }).catch((err: Error) =>
        Promise.reject(new Error('Internal server error'))
    );

    return !matchData
        ? Promise.reject(new Error('No match with that identifier'))
        : Promise.resolve(matchData);
}

export async function createMatch(
    playerId1: Types.ObjectId,
    playerId2: Types.ObjectId
): Promise<MatchDocument> {
    const playersChat: ChatDocument = await createChat([playerId1, playerId2]);
    const observersChat: ChatDocument = await createChat([]);

    const match = new MatchModel({
        player1: { playerId: playerId1 },
        player2: { playerId: playerId2 },
        playersChat: playersChat._id,
        observersChat: observersChat._id,
    });

    return match.save();
}

export async function deleteMatch(matchId: Types.ObjectId): Promise<void> {
    const obj: { deletedCount?: number } = await MatchModel.deleteOne({ _id: matchId }).catch(
        (err: Error) => Promise.reject('An error occurred: ' + err.message)
    );
    return !obj.deletedCount
        ? Promise.reject(new Error('No match with that identifier'))
        : Promise.resolve();
}

/**
 * @param matchId id of the match to update
 * @param winner id of the user that won the match
 * @param totalShots total number of shots fired in the match
 * @param shipsDestroyed total number of ships destroyed in the match
 * @param endTime match ending time in unix seconds
 */
export async function updateMatchStats(
    matchId: Types.ObjectId,
    winner: Types.ObjectId,
    totalShots: number,
    shipsDestroyed: number,
    endTime: number
): Promise<MatchDocument> {
    const match: MatchDocument = await MatchModel.findOne({ _id: matchId }).catch((err: Error) => {
        return Promise.reject(new Error('No match with that id'));
    });

    const updatedStats: MatchStats = {
        winner: winner,
        startTime: match.stats.startTime,
        endTime: new Date(endTime * 1000),
        totalShots: totalShots,
        shipsDestroyed: shipsDestroyed,
    };
    match.set('stats', updatedStats);

    return match.save();
}

// Create "Matches" collection
export const MatchModel: Model<MatchDocument> = mongoose.model('Match', MatchSchema, 'Matches');
