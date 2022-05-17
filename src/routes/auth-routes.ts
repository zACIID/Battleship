import {Router, Request, Response, NextFunction} from 'express';
import {UserModel, getUserByUsername, newUser, UserDocument} from '../models/user';
import passport from 'passport';           
import passportHTTP from 'passport-http';
import jsonwebtoken from 'jsonwebtoken';  
import jwt from 'express-jwt';            

const router = Router();


declare module 'express' {
    export interface Request {
      user: UserDocument;
    }
}



/**
 *  Function provided to passport middleware which verify user credentials 
 */
passport.use( new passportHTTP.BasicStrategy( async function(username: string, password: string, done: Function) {
        
        let user: UserDocument = await getUserByUsername(username)

        if( user.validatePassword( password ) ) {
            return done(null, user);
        }
        return done(null,false);
            
}));



/**
 *  Login endpoint, check the authentication and generate the jwt 
 */
router.get("/login", passport.authenticate('basic', { session: false }), (req: Request, res: Response) => {

    var tokendata = {
      username: req.user.username,
      roles: req.user.roles,
      mail: req.user.mail,
    };
  
    // Token generation with 1h duration
    var token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '1h' } );
  
  
    return res.status(200).json({ error: false, errormessage: "", token: token_signed });
});


/**
 * Request must contain at least these information -> username: string, email: string, roles: string[], password: string
 */
router.post('/users', async (req: Request, res: Response) => {

    try{
        let u = await newUser( req.body );
		await u.setPassword( req.body.password );

		return res.status(200).json({ error: false, errormessage: "", id: u.username });
    }
	//there's no way that typescript can verify at compile time the type of the error thrown
    catch(err: any){
        if( err.code === 11000 ){
            return res.status(400).json({ error:true, errormessage: "User already exists"});
		}
        return res.status(404).json({ error: true, errormessage: "DB error: " + err.message }); 
    }


});