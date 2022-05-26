import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';

import {
    getMatchById,
    MatchDocument,
    createMatch,
    updateMatchStats,
    MatchModel,
} from '../models/match/match';
import { authenticateToken, retrieveMatchId, retrieveUserId } from './auth-routes';
import { GridCoordinates } from '../models/match/state/grid-coordinates';
import { BattleshipGrid } from '../models/match/state/battleship-grid';
import { Shot } from '../models/match/state/shot';

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

interface CreateMatchRequest extends Request {
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
    async (req: Request, res: MatchEndpointResponse) => {
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

interface UpdateStatsBody {
    winner: Types.ObjectId;
    totalShots: number;
    shipsDestroyed: number;
}

interface UpdateStatsRequest extends Request {
    body: UpdateStatsBody;
}

/**
 *   /matches/:matchId/stats | PUT | Update the statistics of the specified match
 *   Return the entire updated object or an error
 */
router.put(
    '/matches/:matchId/stats',
    authenticateToken,
    retrieveMatchId,
    async (req: UpdateStatsRequest, res: MatchEndpointResponse) => {
        try {
            const matchId: Types.ObjectId = res.locals.matchId;
            const { winner, totalShots, shipsDestroyed } = req.body;

            await updateMatchStats(matchId, winner, totalShots, shipsDestroyed);

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

interface UpdateGridRequest extends Request {
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

interface FireShotRequest extends Request {
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
                return res.status(404).json({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    errorMessage: `Match with id ${matchId}not found`,
                    requestPath: req.path,
                });
            }

            await match.registerShot(shot);

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
