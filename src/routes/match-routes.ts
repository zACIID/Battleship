import { Router, Response } from 'express';
import { Types } from 'mongoose';

import {
    getMatchById,
    MatchDocument,
    createMatch,
    updateMatchStats,
    MatchModel,
    getMatchByUserId,
    Match,
} from '../models/match/match';
import { authenticateToken } from './auth-routes';
import { retrieveUserId, retrieveMatchId } from './utils/param-checking';
import { GridCoordinates } from '../models/match/state/grid-coordinates';
import { BattleshipGrid } from '../models/match/state/battleship-grid';
import { PlayerStateSubDocument } from '../models/match/state/player-state';
import { Shot } from '../models/match/state/shot';
import { PlayerStateChangedEmitter } from '../events/socket-io/emitters/player-state-changed';
import { PositioningCompletedEmitter } from '../events/socket-io/emitters/positioning-completed';
import { ioServer } from '../index';
import { ShotFiredEmitter } from '../events/socket-io/emitters/shot-fired';
import { AuthenticatedRequest } from '../models/auth/authenticated-request';

export const router = Router();

interface MatchEndpointLocals {
    matchId: Types.ObjectId;
    userId: Types.ObjectId;
}

interface MatchEndpointResponse extends Response {
    locals: MatchEndpointLocals;
}

interface CreateMatchBody {
    player1: Types.ObjectId;
    player2: Types.ObjectId;
}

interface CreateMatchRequest extends AuthenticatedRequest {
    body: CreateMatchBody;
}

/**
 *  /matches | POST | Create a new match
 *  Returns the response with the newly created match object
 *  If some error occurred, response will contain an error 404
 */
router.post(
    '/matches',
    authenticateToken,
    async (req: CreateMatchRequest, res: MatchEndpointResponse) => {
        try {
            const match: MatchDocument = await createMatch(req.body.player1, req.body.player2);
            const toSend = {
                matchId: match._id,
                player1: match.player1,
                player2: match.player2,
                playersChat: match.playersChat,
                observersChat: match.observersChat,
                stats: match.stats,
            };

            return res.status(201).json(toSend);
        } catch (err) {
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

/**
 *  /matches/:matchId | GET | Retrieve the match with the specified id
 *  Returns the response with the corresponding match object (if present on the db)
 *  Otherwise an error 404
 */
router.get(
    '/matches/:matchId',
    authenticateToken,
    retrieveMatchId,
    async (req: AuthenticatedRequest, res: MatchEndpointResponse) => {
        try {
            let matchId: Types.ObjectId = res.locals.matchId;
            const match: MatchDocument = await getMatchById(matchId);
            const toSend = {
                matchId: match._id,
                player1: match.player1,
                player2: match.player2,
                playersChat: match.playersChat,
                observersChat: match.observersChat,
                stats: match.stats,
            };

            return res.status(200).json(toSend);
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

router.get(
    '/matches/:userId',
    authenticateToken,
    retrieveUserId,
    async (req: AuthenticatedRequest, res: MatchEndpointResponse) => {
        try {
            let userId: Types.ObjectId = res.locals.userId;
            const matches: Match[] = await getMatchByUserId(userId);
            return res.status(200).json(matches);
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

interface UpdateStatsBody {
    winner: string;
    totalShots: number;
    shipsDestroyed: number;
    endTime: number;
}

interface UpdateStatsRequest extends AuthenticatedRequest {
    body: UpdateStatsBody;
}

/**
 *   /matches/:matchId/stats | PATCH | Update the statistics of the specified match
 *   Return the updated fields or an error
 */
router.patch(
    '/matches/:matchId/stats',
    authenticateToken,
    retrieveMatchId,
    async (req: UpdateStatsRequest, res: MatchEndpointResponse) => {
        try {
            const matchId: Types.ObjectId = res.locals.matchId;
            const { winner, totalShots, shipsDestroyed, endTime } = req.body;

            await updateMatchStats(
                matchId,
                Types.ObjectId(winner),
                totalShots,
                shipsDestroyed,
                endTime
            );

            return res.status(200).json(req.body);
        } catch (err) {
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

interface UpdateGridBody extends BattleshipGrid {}

interface UpdateGridRequest extends AuthenticatedRequest {
    body: UpdateGridBody;
}

/**
 * /matches/:matchId/players/:userId/grid   PUT   Update the grid of the specified player of the match
 * Return the updated grid or an error
 */
router.put(
    '/matches/:matchId/players/:userId/grid',
    authenticateToken,
    retrieveMatchId,
    retrieveUserId,
    async (req: UpdateGridRequest, res: MatchEndpointResponse) => {
        try {
            const matchId: Types.ObjectId = res.locals.matchId;
            const playerId: Types.ObjectId = res.locals.userId;

            const match: MatchDocument = await MatchModel.findOne({ _id: matchId });
            if (match === null) {
                throw new Error(`Match with id '${matchId}' not found`);
            }

            await match.updatePlayerGrid(playerId, req.body);

            return res.status(200).json(req.body);
        } catch (err) {
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

interface FireShotBody extends GridCoordinates {}

interface FireShotRequest extends AuthenticatedRequest {
    body: FireShotBody;
}

/**
 * /matches/:matchId/players/:userId/shotsFired   POST   Add a shot made by the specified player
 */
router.post(
    '/matches/:matchId/players/:userId/shotsFired',
    authenticateToken,
    retrieveMatchId,
    retrieveUserId,
    async (req: FireShotRequest, res: Response) => {
        try {
            const matchId: Types.ObjectId = res.locals.matchId;
            const shootingPlayerId: Types.ObjectId = res.locals.userId;
            const shot: Shot = {
                coordinates: req.body,
                playerId: shootingPlayerId,
            };

            const match: MatchDocument = await MatchModel.findOne({ _id: matchId });
            if (match === null) {
                throw new Error(`Match with id ${matchId}not found`);
            }

            await match.registerShot(shot);

            // Notify all players/spectators about the shot
            const notifier: ShotFiredEmitter = new ShotFiredEmitter(ioServer, matchId);
            notifier.emit({
                coordinates: req.body,
                playerId: shootingPlayerId.toString(),
            });

            return res.status(200).json(req.body);
        } catch (err) {
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

interface PlayerReadyRequestBody {
    ready: boolean;
}

interface PlayerReadyRequest extends AuthenticatedRequest {
    body: PlayerReadyRequestBody;
}

/**
 *
 */
router.put(
    '/matches/:matchId/players/:userId/ready',
    authenticateToken,
    retrieveMatchId,
    retrieveUserId,
    async (req: PlayerReadyRequest, res: Response) => {
        try {
            const matchId: Types.ObjectId = res.locals.matchId;
            const playerId: Types.ObjectId = res.locals.userId;
            const newReadyState: boolean = req.body.ready;

            const match: MatchDocument = await MatchModel.findOne({ _id: matchId });
            if (match === null) {
                throw new Error(`Match with id ${matchId}not found`);
            }

            // Update the ready state of the player
            await setReadyState(match, playerId, newReadyState);

            // Send notifications to the players based on their states
            notifyPlayers(match, playerId, newReadyState);

            return res.status(200).json(req.body);
        } catch (err) {
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

/**
 * Sets the isReady field of the player in the match with the new provided value
 *
 * @param match document representing the match that the player is in
 * @param playerId id of the player whose state needs to be changed
 * @param isReady value to set
 */
const setReadyState = async (
    match: MatchDocument,
    playerId: Types.ObjectId,
    isReady: boolean
): Promise<void> => {
    let playerState: PlayerStateSubDocument = null;
    if (match.player1.playerId.equals(playerId)) {
        playerState = match.player1;
    } else if (match.player2.playerId.equals(playerId)) {
        playerState = match.player2;
    } else {
        throw new Error(`User ${playerId} is not part of the match`);
    }

    // Set player state as ready and save the main match document
    playerState.isReady = isReady;
    await match.save();
};

/**
 * Notify the players if both are ready that the positioning phase is completed,
 * else notify just the opponent if only one player is ready
 *
 * @param match match that the two players are in
 * @param playerId id of the player that changed his ready state
 * @param newState value of the ready state set by the player
 */
const notifyPlayers = (match: MatchDocument, playerId: Types.ObjectId, newState: boolean) => {
    if (match.player1.isReady && match.player2.isReady) {
        const notifier = new PositioningCompletedEmitter(ioServer, match._id);
        notifier.emit();
    } else {
        const notifier = new PlayerStateChangedEmitter(ioServer, match._id);
        notifier.emit({
            isReady: newState,
            playerId: playerId.toString(),
        });
    }
};

const getOpponentId = (match: MatchDocument, playerId: Types.ObjectId): Types.ObjectId => {
    const player1Id: Types.ObjectId = match.player1.playerId;
    const player2Id: Types.ObjectId = match.player2.playerId;

    // Opponent is the opposite player
    let opponentId: Types.ObjectId = null;
    if (player1Id.equals(playerId)) {
        opponentId = player2Id;
    } else if (player2Id.equals(playerId)) {
        opponentId = player1Id;
    } else {
        throw new Error(`PlayerId '${playerId}' not in match`);
    }

    return opponentId;
};
