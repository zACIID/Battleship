import { BattleshipGrid } from '../../../../src/app/core/model/match/battleship-grid';
import { RequestObjectId } from './mongodb-api';
import * as dbMatch from '../../../../../src/model/match/match';
import * as dbPlayerState from '../../../../../src/model/match/state/player-state';
import * as dbMatchStats from '../../../../../src/model/match/match-stats';

/**
 * Interface that models player state data, accounting for the fact
 * that MongoDb Data Api needs an $oid wrapper on ObjectIds
 */
export interface MongoDbApiPlayerState {
    playerId: RequestObjectId;
    grid: BattleshipGrid;
    isReady: boolean;
}

/**
 * Interface that models match stats data, accounting for the fact
 * that MongoDb Data Api needs an $oid wrapper on ObjectIds
 */
export interface MongoDbApiMatchStats {
    winner: RequestObjectId;
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
    playersChat: RequestObjectId;
    observersChat: RequestObjectId;
    stats: MongoDbApiMatchStats;
}

export const toMongoDbApiMatch = (data: dbMatch.Match): MongoDbApiMatch => {
    return {
        player1: toMongoDbApiPlayerState(data.player1),
        player2: toMongoDbApiPlayerState(data.player2),
        playersChat: new RequestObjectId(data.playersChat),
        observersChat: new RequestObjectId(data.observersChat),
        stats: toMongoDbApiMatchStats(data.stats),
    };
};

export const toMongoDbApiPlayerState = (
    pState: dbPlayerState.PlayerState
): MongoDbApiPlayerState => {
    return {
        playerId: new RequestObjectId(pState.playerId),
        grid: pState.grid,
        isReady: pState.isReady,
    };
};

export const toMongoDbApiMatchStats = (pStats: dbMatchStats.MatchStats): MongoDbApiMatchStats => {
    return {
        winner: new RequestObjectId(pStats.winner),
        startTime: new Date(),
        endTime: new Date(),
        totalShots: pStats.totalShots,
        shipsDestroyed: pStats.shipsDestroyed,
    };
};
