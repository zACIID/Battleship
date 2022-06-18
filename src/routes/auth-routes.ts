import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import jsonwebtoken from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { Strategy } from 'passport-local';

import {
    createUser,
    getUserByUsername,
    setUserStatus,
    UserDocument,
    UserStatus,
} from '../model/database/user/user';
import { AnyKeys } from 'mongoose';
import { ioServer } from '../index';
import { JwtData } from '../model/api/auth/jwt-data';
import { AuthenticatedRequest } from './utils/authenticated-request';

export const router = Router();

/**
 * This function verifies the authentication token that comes with each
 * request to an authenticated endpoint.
 *
 * @param req request
 * @param res response
 * @param next function to move to the next middleware
 */
export const authenticateToken = function (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err: any, content: JwtData) => {
        if (err)
            return res.status(403).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });

        // Here the content of the token is assigned
        // to its own request field, so that each endpoint
        // can access it
        req.jwtContent = content;

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
passport.use(new Strategy(localAuth));

interface AuthenticationRequestBody {
    username: string;
    password: string;
}

interface SignInRequest extends Request {
    body: AuthenticationRequestBody;

    /**
     * Field inserted by passport-local authentication middleware
     */
    user: UserDocument;
}

/**
 *  Login endpoint, check the authentication and generate the jwt
 */
router.post(
    '/auth/signin',
    passport.authenticate('local', { session: false }),
    async (req: SignInRequest, res: Response) => {
        const tokenData: JwtData = {
            userId: req.user._id,
            roles: req.user.roles,
        };

        // Token generation with 1h duration
        const signed_token = jsonwebtoken.sign(tokenData, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // The user comes online after login, only if its status isn't Temporary
        // in that case, the status is preserved, because it is a flag that
        // the user (a new moderator) has to update his credentials.
        if (req.user.status !== UserStatus.TemporaryCredentials) {
            // TODO side-effect needs to be tested
            await setUserStatus(ioServer, req.user._id, UserStatus.Online);
        }

        // Return the token along with the id of the authenticated user
        return res.status(200).json({
            userId: req.user._id,
            token: signed_token,
        });
    }
);

interface SignUpRequest extends Request {
    body: AuthenticationRequestBody;
}

/**
 * Request must contain at least this information -> username: string, password: string
 */
router.post('/auth/signup', async (req: SignUpRequest, res: Response) => {
    try {
        // A user that registers through this endpoint becomes online right away
        const userData: AnyKeys<UserDocument> = {
            username: req.body.username,
            status: UserStatus.Online,
        };
        const newUser: UserDocument = await createUser(userData);

        await newUser.setPassword(req.body.password);

        return res.status(201).json({
            userId: newUser._id,
            username: newUser.username,
            roles: newUser.roles,
            status: newUser.status,
            elo: newUser.stats.elo,
        });
    } catch (err) {
        return res.status(400).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
});
