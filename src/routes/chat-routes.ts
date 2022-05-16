import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// Retrieving schema from model
import {Chat, IChat, IMessage} from '../models/chat';
import {User, IUser} from '../models/user';
import {Match, IMatch} from '../models/match';


/*
Endpoints                               Method     Description

 /chats                                 GET        Returns the list of all the chat of a user
 /chats                                 POST       Add a new chat in the user's chat list

 /chats/:chatId                         DELETE     Delete a chat by ID

 /chats/:chatId/messages                GET        Returns all the messages in a chat
 /chats/:chatId/messages                POST       Post a new message in a chat
*/


interface CustomRequest extends Request{
    user_id: string,
}


function integrityCheck(request: CustomRequest, response: Response) : Response{

    // Check if user is logged
    if (!request.user_id) { return response.status(401).send('Not authenticated'); }

}


router.get('/chats', async (req: CustomRequest, res: Response, next: NextFunction) => {

	
    integrityCheck(req, res);

	// Retrieve userId from the parameters of the request
	const user: string = req.params.userId;

    try{
	    // Find all the existing chat where an user is found inside the "users" list
        let found: IUser  = await User.findById(user).exec();
        res.json(found.chats);
    }
    catch(err){
        console.log(err);
        next(err);
    }
})


router.get('/chats/:chatId/messages', async (req: CustomRequest, res: Response, next: NextFunction) => {

    integrityCheck(req, res);
    
	// Retrieve chatId from the parameters of the request
	const chat: string = req.params.chatId;

    try{
        // Find all the existing chat where an user is found inside the "users" list
        let found: IChat = await Chat.findById(chat).exec();
        
        res.json(found.messages);
    }
    catch(err){
        console.log(err);
        next(err);
    }
});

router.post('/chats/:chatId/messages', async (req: CustomRequest, res: Response, next: NextFunction) => {

    integrityCheck(req, res);

	// Retrieve userId from the parameters of the request
	const chat: string = req.params.chatId;

    try {

        const found: IChat = await Chat.findById(chat).exec();

        const newMessage: IMessage = {
            content: req.body.content,
            timestamp: new Date(),
            author: req.body.user_id
        };

        found.messages.push(newMessage);

        await Chat.updateOne({ _id: found._id}, { $set: {messages: found.messages} });
    }
    catch(err){
        //For logging purposes
        console.log(err);
        next(err);
    }
});

module.exports = router
