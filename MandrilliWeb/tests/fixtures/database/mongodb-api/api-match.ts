import { BattleshipGrid } from '../../../../src/app/core/model/match/battleship-grid';
import { ApiObjectId } from './mongodb-api';
import * as dbMatch from '../../../../../src/model/database/match/match';
import * as dbPlayerState from '../../../../../src/model/database/match/state/player-state';
import * as dbMatchStats from '../../../../../src/model/database/match/match-stats';

/**
 * Interface that models player state data, accounting for the fact
 * that MongoDb Data Api needs an $oid wrapper on ObjectIds
 */
export interface MongoDbApiPlayerState {
    playerId: ApiObjectId;
    grid: BattleshipGrid;
    isReady: boolean;
}

/**
 * Interface that models match stats data, accounting for the fact
 * that MongoDb Data Api needs an $oid wrapper on ObjectIds
 */
export interface MongoDbApiMatchStats {
    winner: ApiObjectId;
    startTime: Date;
    endTime: Date;
    totalShots: number;
    shipsDestroyed: number;
}

/**
 * Interface that models the data required for a match, but accounts for the fact that
 * ObjectId fields need to be wrapped in $oid objects
 */
export interface MongoDbApiMatch {
    player1: MongoDbApiPlayerState;
    player2: MongoDbApiPlayerState;
    playersChat: ApiObjectId;
    observersChat: ApiObjectId;
    stats: MongoDbApiMatchStats;
}

export const toMongoDbApiMatch = (data: dbMatch.Match): MongoDbApiMatch => {
    return {
        player1: toMongoDbApiPlayerState(data.player1),
        player2: toMongoDbApiPlayerState(data.player2),
        playersChat: new ApiObjectId(data.playersChat),
        observersChat: new ApiObjectId(data.observersChat),
        stats: toMongoDbApiMatchStats(data.stats),
    };
};

export const toMongoDbApiPlayerState = (
    pState: dbPlayerState.PlayerState
): MongoDbApiPlayerState => {
    return {
        playerId: new ApiObjectId(pState.playerId),
        grid: pState.grid,
        isReady: pState.isReady,
    };
};

export const toMongoDbApiMatchStats = (pStats: dbMatchStats.MatchStats): MongoDbApiMatchStats => {
    return {
        winner: new ApiObjectId(pStats.winner),
        startTime: new Date(),
        endTime: new Date(),
        totalShots: pStats.totalShots,
        shipsDestroyed: pStats.shipsDestroyed,
    };
};
