
import {Router, Request, Response, NextFunction} from 'express';
import {getLeaderboard, UserDocument} from '../models/user';
import { authenticateToken } from './auth-routes';


const router = Router();


router.get("/leaderboard", authenticateToken, async ( req: Request, res: Response ) => {
    let leaderBoard: UserDocument[]
    try {
        leaderBoard = await getLeaderboard()
    } catch(err) {
        res.status(500).json({ 
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path
        })
    }
    // TODO cos'è nextpage e che ci devo passare
    res.send(200).json({ leaderBoard , "nextPage": ""})
})