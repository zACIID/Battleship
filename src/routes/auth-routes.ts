import { Router, Request, Response, NextFunction } from 'express';
import { getUserByUsername, createUser, UserDocument } from '../models/user';
import passport from 'passport';
import passportHTTP from 'passport-http';
import jsonwebtoken from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import LocalStrategy from 'passport-local' 

export const router = Router();

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

        if (err) return res.sendStatus(403); // Unauthorized

        req.user = user;

        next();
    });
};

/**
 *  Function provided to passport middleware which verifies user credentials
 */
const myAuth = async function (
  request: Response,
  username: string,
  password: string,
  done: Function
) {

    let authResults: Function;
    let user: UserDocument | void = await getUserByUsername(username)
    .catch((err: Error) => {
        authResults = done({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: "/auth/signin",
            }, null, null);
        }
    );

    if (user && await user.validatePassword(password)) {
        authResults = done(null, user);
    }
    else{
        authResults = done(null, false);
    }

    return authResults;
};

passport.use(new LocalStrategy({ passReqToCallback: true }, myAuth));

/**
 *  Login endpoint, check the authentication and generate the jwt
 */
router.post(
    '/auth/signin',
    passport.authenticate('local', { session: false }),
    (req: Request, res: Response) => {
        // TODO Hint? https://stackoverflow.com/questions/47567943/passport-js-custom-error-for-unauthorized-and-bad-request
        
        const tokenData = {
            username: req.user.username,
            roles: req.user.roles,
        };

        // Token generation with 1h duration
        const signed_token = jsonwebtoken.sign(tokenData, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.status(200).json({ token: signed_token });
    }
);

/**
 * Request must contain at least this information -> username: string, roles: string[], password: string
 */
router.post('/auth/signup', async (req: Request, res: Response) => {
    let u: UserDocument;
    try {
        u = await createUser(req.body);
    } catch (err) {
        if(err.message === "User already exists"){
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
        else{
            return res.status(500).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }

    await u
        .setPassword(req.body.password)
        .catch((err: Error) => res.status(500).json({ error: true, errormessage: err.message }));

    return res.status(201).json( {"userId": u._id, "username": u.username, "roles": u.roles, "online": u.online});
});
