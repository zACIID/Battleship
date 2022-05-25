import { Router, Request, Response } from 'express';
import {
    getMatchById,
    MatchDocument,
    createMatch,
    updateMatchStats,
} from '../models/match/match';
import { Types } from 'mongoose';
import { authenticateToken, retrieveMatchId } from './auth-routes';

export const router = Router();

interface PostBody {
    player1: Types.ObjectId;
    player2: Types.ObjectId;
}

interface PostRequest extends Request {
    body: PostBody;
}

interface PatchBody {
    winner: Types.ObjectId;
    totalShots: Number;
    shipsDestroyed: Number;
}

interface PatchRequest extends Request {
    body: PatchBody;
}

/**
 *  /matches | POST | Create a new match
 *  Returns the response with the newly created match object
 *  If some errors occurred, response will contains an error 404
 */
router.post('/matches', authenticateToken, async (req: PostRequest, res: Response) => {
    let m: MatchDocument;
    try {
        m = await createMatch(req.body.player1, req.body.player2);
    } catch (err) {
        return res.status(500).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
    return res.status(201).json(m);
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
        let matchId: Types.ObjectId = res.locals.matchId;
        let match: MatchDocument;

        try {
            match = await getMatchById(matchId);
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }

        return res.status(200).json({ match });
    }
);

/**
 *   /matches/:matchId/stats | PUT | Update the statistics of the specified match
 *   Return the entire updated object or an error
 */
router.put(
    '/matches/:matchId/stats',
    authenticateToken,
    retrieveMatchId,
    async (req: PatchRequest, res: Response) => {
        let matchId: Types.ObjectId = res.locals.matchId;

        const { winner, totalShots, shipsDestroyed } = req.body;

        await updateMatchStats(matchId, winner, totalShots, shipsDestroyed).catch((err: Error) => {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        });

        return res.status(200).json(req.body);
    }
);
