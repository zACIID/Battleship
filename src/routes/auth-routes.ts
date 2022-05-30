import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import jsonwebtoken from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import LocalStrategy from 'passport-local';

import { createUser, getUserByUsername, UserDocument, UserModel } from '../models/user/user';
import { Types } from 'mongoose';
import { FriendOnlineEmitter } from '../events/socket-io/emitters/friend-online';
import { ioServer } from '../index';

export const router = Router();

// TODO cos'è?
declare module 'express' {
    export interface Request {
        user: UserDocument;
    }
}

export const authenticateToken = function (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: UserDocument) => {
        if (err)
            return res.status(403).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });

        req.user = user;

        next();
    });
};

/**
 *  Function provided to passport middleware which verifies user credentials
 */
const localAuth = async function (username: string, password: string, done: Function) {
    let user: UserDocument | void = await getUserByUsername(username).catch((err: Error) => {
        return done(err);
    });

    if (user && (await user.validatePassword(password))) {
        return done(null, user);
    } else {
        return done(null, false);
    }
};

passport.use(new LocalStrategy(localAuth));

/**
 *  Login endpoint, check the authentication and generate the jwt
 */
router.post(
    '/auth/signin',
    passport.authenticate('local', { session: false }),
    async (req: Request, res: Response) => {
        const tokenData = {
            username: req.user.username,
            roles: req.user.roles,
        };

        // Token generation with 1h duration
        const signed_token = jsonwebtoken.sign(tokenData, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        await notifyFriends(req.user.username);

        return res.status(200).json({ token: signed_token });
    }
);

const notifyFriends = async (username: string) => {
    const userOnline: UserDocument = await UserModel.findOne({ username: username });
    const friendsIdsToNotify: Types.ObjectId[] = userOnline.relationships.map((rel) => {
        return rel.friendId;
    });

    friendsIdsToNotify.forEach((toNotifyId: Types.ObjectId) => {
        const notifier: FriendOnlineEmitter = new FriendOnlineEmitter(ioServer, toNotifyId);
        notifier.emit({
            friendId: userOnline._id
        });
    });
}

/**
 * Request must contain at least this information -> username: string, roles: string[], password: string
 */
router.post('/auth/signup', async (req: Request, res: Response) => {
    let u: UserDocument;
    try {
        // A user that registers through this endpoint becomes online right away
        const userData = {
            username: req.body.username,
            online: true
        }
        u = await createUser(userData);

        await u.setPassword(req.body.password);

        return res
            .status(201)
            .json({ userId: u._id, username: u.username, roles: u.roles, online: u.online });
    } catch (err) {
        if (err.message === 'User already exists') {
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        } else {
            return res.status(500).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
});
