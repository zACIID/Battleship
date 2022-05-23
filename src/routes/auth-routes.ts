import { Router, Request, Response, NextFunction } from 'express';
import { getUserByUsername, createUser, UserDocument } from '../models/user';
import passport from 'passport';
import jsonwebtoken from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import LocalStrategy from 'passport-local'
import { Types } from 'mongoose'; 

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

        if (err) return res.status(403).json({
            
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
            
        }); 

        req.user = user;

        next();
    });
};


export const retrieveUserId = function(req: Request, res: Response, next: NextFunction){
    try{
        const userId: Types.ObjectId = Types.ObjectId(req.params.userId);
        res.locals.userId = userId;
        next();
    }
    catch(err){
        return res.status(404).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
    
}


export const retrieveId = function(s_id: string){
    try{
        return Types.ObjectId(s_id);
    }
    catch(err){
        throw new Error("No user with that id")
    }
}



export const retrieveChatId = function(req: Request, res: Response, next: NextFunction){
    try{
        const chatId: Types.ObjectId = Types.ObjectId(req.params.chatId);
        res.locals.chatId = chatId;
        next();
    }
    catch(err){
        return res.status(404).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
    
}



export const retrieveMatchId = function(req: Request, res: Response, next: NextFunction){
    try{
        const matchId: Types.ObjectId = Types.ObjectId(req.params.matchId);
        res.locals.chatId = matchId;
        next();
    }
    catch(err){
        res.status(404).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
    
}



/**
 *  Function provided to passport middleware which verifies user credentials
 */
const localAuth = async function (
  username: string,
  password: string,
  done: Function
) {

    let user: UserDocument | void = await getUserByUsername(username)
    .catch((err: Error) => {
        return done(err);
    });

    if (user && await user.validatePassword(password)) {
        return done(null, user);
    }
    else{
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
    (req: Request, res: Response) => {
        
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
        await u.setPassword(req.body.password);
        return res.status(201).json( {"userId": u._id, "username": u.username, "roles": u.roles, "online": u.online});
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
});
