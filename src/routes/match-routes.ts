import * as mongoose from 'mongoose';
import {Router, Request, Response, NextFunction} from 'express';
import {getMatchById, MatchDocument, createMatch, deleteMatch, updateMatchStats} from '../models/match';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { UserDocument } from '../models/user';

const router = Router();

interface PostRequest extends Request {
    player1: Types.ObjectId;
    player2: Types.ObjectId;
}

interface PatchRequest extends Request {
    winner: Types.ObjectId;
    totalShots: Number;
    shipsDestroyed: Number;
}



function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: UserDocument) => {
    console.log(err)

    if (err) return res.sendStatus(403)  // Unauthorized

    req.user = user

    next()
  })
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
            "timestamp": Math.floor(new Date().getTime() / 1000),
            "errorMessage": err.message,
            "requestPath": "/matches"
        });
    }
    return res.status(201).json( m );

});


/**
 *  /matches/:matchId | GET | Retrieve the match with the specified id 
 *  Returns the response with the corresponding match object (if present on the db)
 *  Otherwise an error 404
 */
 router.get('/matches/:matchId', authenticateToken, async (req: Request, res: Response) => {


    let matchId: Types.ObjectId = mongoose.Types.ObjectId(req.params.matchId);

    let match = await getMatchById(matchId)
    .catch((err: Error) => { return res.status(404).json({
        "timestamp": Math.floor(new Date().getTime() / 1000),
        "errorMessage": err.message,
        "requestPath": "/matches/" + matchId
    })});

    return res.status(200).json({match});

});


/**
 *   /matches/:matchId | DELETE | Delete the match with the provided id
 *   Returns an empty response if elimination went through, an error otherwise
 */
 router.delete('/matches/:matchId', authenticateToken, async (req: Request, res: Response) => {

    let matchId: Types.ObjectId = mongoose.Types.ObjectId(req.params.matchId);

    await deleteMatch(matchId)
    .catch((err: Error) => { return res.status(404).json({
        "timestamp": Math.floor(new Date().getTime() / 1000),
        "errorMessage": err.message,
        "requestPath": "/matches/" + matchId
    })});

    return res.status(200).json();

});


/**
 *   /matches/:matchId/stats | PATCH | Update the statistics of the specified match
 *   Return the entire updated object or an error
 */
 router.patch('/matches/:matchId', authenticateToken, async (req: PatchRequest, res: Response) => {

    let matchId: Types.ObjectId = mongoose.Types.ObjectId(req.params.matchId);

    await updateMatchStats(matchId, req.body.winner, req.body.totalShots, req.body.shipsDestroyed)
    .catch((err: Error) => { return res.status(404).json({
        "timestamp": Math.floor(new Date().getTime() / 1000),
        "errorMessage": err.message,
        "requestPath": "/matches/" + matchId
    })});

    let updatedMatch: MatchDocument = await getMatchById(matchId);
    return res.status(200).json(updatedMatch);

});

