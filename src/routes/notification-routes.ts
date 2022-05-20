import * as mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import { RequestTypes } from '../models/notification';
import { UserDocument, getUserById } from '../models/user';
import { authenticateToken } from './auth-routes';
import {Types} from 'mongoose';


const router = Router();


interface PostBody {
    type: string;
    sender: Types.ObjectId;
}

interface NotificationRequest extends Request {
    body: PostBody;
}


/**
 *    /users/:userId/notifications | GET | Retrieve the notifications of the specified user
 */
 router.get('/users/:userId/notifications', authenticateToken, async (req: Request, res: Response) => {
    
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    
    let user: UserDocument;

    try {
        user = await getUserById(userId);

    } catch(err) {
        return res.status(404).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
    // TODO check la paginazione
    return res.status(200).json( { "notifications":user.notifications, "nextPage": "" } );
});



/**
 *    /users/:userId/notifications | POST | Add a notification to the specified user
 */
 router.post('/users/:userId/notifications', authenticateToken, async (req: NotificationRequest, res: Response) => {
    
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    const type: RequestTypes = RequestTypes[RequestTypes[req.body.type]]
    let user: UserDocument;

    try {
        user = await getUserById(userId);
        user.addNotification(type, req.body.sender);

    } catch(err) {
        return res.status(500).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }

    return res.status(200).json( { "type":type, "sender":req.body.sender } );
});



/**
 *   /users/:userId/notifications | DELETE | Remove the notification from the specified user
 */
 router.delete('/users/:userId/notifications', authenticateToken, async (req: NotificationRequest, res: Response) => {
    
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    const type: RequestTypes = RequestTypes[RequestTypes[req.body.type]]
    let user: UserDocument;

    try {
        user = await getUserById(userId);
        user.removeNotification(type, req.body.sender);

    } catch(err) {
        return res.status(404).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }

    return res.status(204).json(  );
});