import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';

import { getMatchById, MatchDocument, createMatch, updateMatchStats } from '../models/match/match';
import { authenticateToken, retrieveMatchId } from './auth-routes';
import { Ship } from '../models/match/state/ship';
import { GridCoordinates } from '../models/match/state/grid-coordinates';

export const router = Router();

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
router.post('/matches', authenticateToken, async (req: CreateMatchRequest, res: Response) => {
    try {
        const m: MatchDocument = await createMatch(req.body.player1, req.body.player2);

        return res.status(201).json(m);
    } catch (err) {
        return res.status(400).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
});

/**
 *  /matches/:matchId | GET | Retrieve the match with the specified id
 *  Returns the response with the corresponding match object (if present on the db)
 *  Otherwise an error 404
 */
router.get(
    '/matches/:matchId',
    authenticateToken,
    retrieveMatchId,
    async (req: Request, res: Response) => {
        try {
            let matchId: Types.ObjectId = res.locals.matchId;
            const match: MatchDocument = await getMatchById(matchId);

            return res.status(200).json({ match });
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
    totalShots: Number;
    shipsDestroyed: Number;
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
    async (req: UpdateStatsRequest, res: Response) => {
        try {
            const matchId: Types.ObjectId = res.locals.matchId;
            const { winner, totalShots, shipsDestroyed } = req.body;

            await updateMatchStats(matchId, winner, totalShots, shipsDestroyed);

            return res.status(200).json(req.body);
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

interface UpdateGridBody {
    ships: Ship[];
    shotsReceived: GridCoordinates[];
}

interface UpdateGridRequest extends Request {
    body: UpdateGridBody;
}

/**
 * /matches/:matchId/players/:playerId/grid   PUT   Update the grid of the specified player of the match
 * Return the updated grid or an error
 */
router.put(
    '/matches/:matchId/players/:playerId/grid',
    authenticateToken,
    retrieveMatchId,
    async (req: UpdateGridRequest, res: Response) => {
        try {
            // TODO
            throw new Error("Not implemented");
        }
        catch (err) {
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
 * /matches/:matchId/players/:playerId/shotsFired   POST   Add a shot made by the specified player
 */
router.post(
    '/matches/:matchId/players/:playerId/grid',
    authenticateToken,
    retrieveMatchId,
    async (req: FireShotRequest, res: Response) => {
        try {
            // TODO
            throw new Error("Not implemented");
        }
        catch (err) {
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);
