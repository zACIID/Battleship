import { Router, Request, Response, NextFunction } from 'express';
import { getUserByUsername, createUser, UserDocument } from '../models/user';
import passport from 'passport';
import passportHTTP from 'passport-http';
import jsonwebtoken from 'jsonwebtoken';

const router = Router();

declare module 'express' {
    export interface Request {
        user: UserDocument;
    }
}

/**
 *  Function provided to passport middleware which verifies user credentials
 */
passport.use(
    new passportHTTP.BasicStrategy(async function (
        username: string,
        password: string,
        done: Function
    ) {
        let user: UserDocument = await getUserByUsername(username).catch((err: Error) =>
            done({ statuscode: 500, error: true, errormessage: err })
        );

        if (await user.validatePassword(password)) {
            return done(null, user);
        }
        return done(null, false);
    })
);

/**
 *  Login endpoint, check the authentication and generate the jwt
 */
router.get(
    '/auth/signin',
    passport.authenticate('basic', { session: false }),
    (req: Request, res: Response) => {
        const tokenData = {
            username: req.user.username,
            roles: req.user.roles,
            mail: req.user.mail,
        };

        // Token generation with 1h duration
        const signed_token = jsonwebtoken.sign(tokenData, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.status(200).json({ error: false, errormessage: '', token: signed_token });
    }
);

/**
 * Request must contain at least this information -> username: string, email: string, roles: string[], password: string
 */
router.post('/auth/signup', async (req: Request, res: Response) => {
    let u: UserDocument;
    try {
        u = await createUser(req.body);
    } catch (err) {
        return res.status(400).json({ error: true, errormessage: err.message });
    }

    await u
        .setPassword(req.body.password)
        .catch((err: Error) => res.status(500).json({ error: true, errormessage: err.message }));

    return res.status(200).json({ error: false, errormessage: '', id: u.username });
});
