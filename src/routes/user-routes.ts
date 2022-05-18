
import * as express from 'express';
import { UserModel } from '../models/user';
import {Router, Request, Response, NextFunction} from 'express';
import { Types } from 'mongoose';
import {updateUser, getLeaderboard, UserDocument, getUserById, deleteUser, getUserStats} from '../models/user';
import {UserStats} from '../models/user-stats';
import { authenticateToken } from './auth-routes';
import * as mongoose from 'mongoose';


interface PatchUserBody {
    username: string;
    password: string;
}

interface PatchStatsBody {
    //??
}

interface PatchUserRequest extends Request {
    body: PatchUserBody;
}

interface PatchStatsRequest extends Request {
    body: PatchStatsBody;
}

const router = Router();
const userErr: string = 'No user with that id'

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

    res.send(200).json({ leaderBoard })
})


router.get("/users/:userId", authenticateToken, async ( req: Request, res: Response ) => {
    let user: UserDocument 
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    try {
        user = await getUserById( userId )
    } catch (err) {
        const statusCode: number = (err.message === userErr)? 404 : 500
        res.status(statusCode).json({ 
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path
        })
    }
    res.send(200).json({ user })
})

router.patch("/users/:userId", authenticateToken, async ( req: PatchUserRequest, res: Response ) => {
    const { username, password } = req.body
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    await updateUser( userId, username, password ).catch((err) => { // TO DO: tutti i campi necessari?
        const statusCode: number = (err.message === userErr)? 404 : 500
        res.status(statusCode).json({ 
            timestamp: 1651881600, // Unix seconds timestamp
            errorMessage: "some error message",
            requestPath: "error/request/path"
        })
    })
    res.send(200).json({ username, password })
})

router.delete("/users/:userId", authenticateToken, async ( req: Request, res: Response ) => {
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    await deleteUser( userId ).catch((err) => {
        const statusCode: number = (err.message === userErr)? 404 : 500
        res.status(statusCode).json({ 
            timestamp: 1651881600, // Unix seconds timestamp
            errorMessage: "some error message",
            requestPath: "error/request/path"
        })
    })

    res.send(204).json({  })
})

router.get("/users/:userId/stats", authenticateToken, async ( req: Request, res: Response ) => {
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    let stats: UserStats
    try {
        stats = await getUserStats( userId )
    } catch(err) {
        const statusCode: number = (err.message === userErr)? 404 : 500
        res.status(statusCode).json({ 
            timestamp: 1651881600, // Unix seconds timestamp
            errorMessage: "some error message",
            requestPath: "error/request/path"
        })
    }
    res.send(200).json({ stats })
})

router.patch("/users/:userId/stats", authenticateToken, async ( req: PatchStatsRequest, res: Response ) => {
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    let stats: UserStats
    try {
        stats = await getUserStats( userId ) //TO DO tutti campi necessari?
    } catch(err) {
        const statusCode: number = (err.message === userErr)? 404 : 500
        res.status(statusCode).json({ 
            timestamp: 1651881600, // Unix seconds timestamp
            errorMessage: "some error message",
            requestPath: "error/request/path"
        })
    }
    res.send(200).json({ stats })
})




