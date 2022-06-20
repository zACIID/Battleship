import * as mongoose from 'mongoose';
import { Document, Model, Schema, SchemaTypes, Types } from 'mongoose';
import { ChatDocument, createChat } from '../chat/chat';

import { MatchStats, MatchStatsSchema, MatchStatsSubDocument } from './match-stats';
import { PlayerState, PlayerStateSchema, PlayerStateSubDocument } from './state/player-state';
import { BattleshipGrid, BattleshipGridSubDocument } from './state/battleship-grid';
import { Shot } from './state/shot';
import { GridCoordinates } from './state/grid-coordinates';
import * as usr from '../user/user';
import { UserDocument, UserStatus } from '../user/user';
import { MatchStatsUpdate } from '../../api/match/stats-update';
import { fromUnixSeconds } from '../../../routes/utils/date-utils';

export interface Match {
    player1: PlayerState;
    player2: PlayerState;

    playersChat: Types.ObjectId;
    observersChat: Types.ObjectId;
    stats: MatchStats;
}

/**
 * Interface that represents a Match document.
 * Such document represents a match between two players and the two model
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
        default: (): MatchStats => ({
            winner: null,
            startTime: new Date(),
            endTime: null,
            totalShots: 0,
            shipsDestroyed: 0,
        }),
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

    let isShotDuplicate: boolean = false;
    const shotCoords: GridCoordinates = shot.coordinates;
    receivingGrid.shotsReceived.forEach((coords) => {
        if (coords.row === shotCoords.row && coords.col === shotCoords.col) {
            isShotDuplicate = true;
        }
    });

    if (isShotDuplicate) {
        return Promise.reject(
            new Error(
                `Coordinates (${shotCoords.row}, ${shotCoords.col})` + 'have already been shot'
            )
        );
    }

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
 * @param statsUpdate object containing the new stats of the match
 */
export async function updateMatchStats(
    matchId: Types.ObjectId,
    statsUpdate: MatchStatsUpdate
): Promise<MatchDocument> {
    const match: MatchDocument = await MatchModel.findOne({ _id: matchId }).catch((err: Error) => {
        return Promise.reject(new Error('No match with that id'));
    });

    const updatedStats: MatchStats = {
        winner: Types.ObjectId(statsUpdate.winner),
        startTime: match.stats.startTime,
        endTime: fromUnixSeconds(statsUpdate.endTime),
        totalShots: statsUpdate.totalShots,
        shipsDestroyed: statsUpdate.shipsDestroyed,
    };
    match.set('stats', updatedStats);

    return match.save();
}

/**
 * Retrieves the current match of the user.
 * If the user is not currently in game or in preparation phase, an error is thrown,
 * since there is no current match.
 * @param userId id of the user to retrieve the current match of
 */
export const getCurrentMatch = async (userId: Types.ObjectId): Promise<MatchDocument> => {
    const user: UserDocument = await usr.getUserById(userId);

    if (user.status === UserStatus.InGame || user.status === UserStatus.PrepPhase) {
        const userMatches: MatchDocument[] = await getUserMostRecentMatches(userId, 0, 1);

        // Since the user is InGame or in PrepPhase, the most recent match
        // should be the match he is currently playing in
        return userMatches[0];
    } else {
        throw new Error(`User ${userId} is not currently in a match`);
    }
};

/**
 * Retrieves the most recent matches of the specified user.
 * Skip and limit params can be used to paginate database requests
 *
 * @param userId id of the user whose matches are to retrieve
 * @param skip number of matches to skip
 * @param limit number of matches to retrieve
 */
export const getUserMostRecentMatches = async (
    userId: Types.ObjectId,
    skip: number = 0,
    limit: number = 10
): Promise<MatchDocument[]> => {
    const mostRecentMatches: MatchDocument[] = await MatchModel.find({
        $or: [{ 'player1.playerId': userId }, { 'player2.playerId': userId }],
    })
        .sort({ 'stats.startTime': -1 })
        .skip(skip)
        .limit(limit);

    return !mostRecentMatches
        ? Promise.reject(new Error(`No matches found for user ${userId}`))
        : Promise.resolve(mostRecentMatches);
};

// Create "Matches" collection
export const MatchModel: Model<MatchDocument> = mongoose.model('Match', MatchSchema, 'Matches');
