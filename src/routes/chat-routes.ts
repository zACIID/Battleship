import * as mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import { ChatDocument, getChatById, deleteChat } from '../models/chat';
import { Message } from '../models/message';
import { authenticateToken, retrieveChatId, retrieveUserId } from './auth-routes';
import { Types } from 'mongoose';

export const router = Router();

interface UserPostBody {
    userId: Types.ObjectId;
}

interface UserPostRequest extends Request {
    body: UserPostBody;
}

interface MessagePostBody {
    author: Types.ObjectId;
    content: string;
    timestamp: Date;
}

interface MessagePostRequest extends Request {
    body: MessagePostBody;
}

/**
 *   /chats/:chatId | GET | Retrieve the chat with the specified id
 *   Return the entire chat object or a 404 error if chat is not found
 */
router.get('/chats/:chatId', authenticateToken, retrieveChatId, async (req: Request, res: Response) => {
    const chatId: Types.ObjectId = res.locals.chatId;

    let chat: ChatDocument;

    try {
        chat = await getChatById(chatId);
    } catch (err) {
        return res.status(404).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }

    return res.status(200).json({ chat });
});

/**
 *   /chats/:chatId | DELETE | Delete the chat with the provided id
 *   Returns an empty response or an error 404 if something went wrong
 */
router.delete('/chats/:chatId', authenticateToken, retrieveChatId, async (req: Request, res: Response) => {
    const chatId: Types.ObjectId = res.locals.chatId

    await deleteChat(chatId).catch((err: Error) => {
        return res.status(404).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    });

    return res.status(204).json();
});

/**
 *   /chats/:chatId/users | POST | Add the user with the provided id (in the request body) to the specified chat |
 */
router.post(
    '/chats/:chatId/users',
    authenticateToken,
    retrieveChatId,
    async (req: UserPostRequest, res: Response) => {
        const chatId: Types.ObjectId = res.locals.chatId

        let chat: ChatDocument;

        try {
            chat = await getChatById(chatId);
            chat.addUser(req.body.userId);
        } catch (err) {
            return res.status(500).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
        return res.status(200).json(req.body.userId);
    }
);

/**
 *   /chats/:chatId/users/:userId | DELETE | Remove the user with the specified id from the specified chat
 *   Returns an empty response or a 404 error
 */
router.delete(
    '/chats/:chatId/users/:userId',
    authenticateToken,
    retrieveChatId,
    retrieveUserId,
    async (req: Request, res: Response) => {
        const chatId: Types.ObjectId = res.locals.chatId;
        const userId: Types.ObjectId = res.locals.userId;
        let chat: ChatDocument;
        try {
            chat = await getChatById(chatId);
            chat.removeUser(userId);
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
        return res.status(200).json();
    }
);

/**
 *    /chats/:chatId/messages | GET | Retrieve the messages of the specified chat
 */
router.get('/chats/:chatId/messages', authenticateToken, retrieveChatId, async (req: Request, res: Response) => {
    const chatId: Types.ObjectId = res.locals.chatId
    let chat: ChatDocument;
    let chat_messages: Message[];
    const skip: number = req.query.skip ? parseInt( req.query.skip as string ) : 0 ;
    const limit: number = req.query.limit ? parseInt( req.query.limit as string ) : 0 ;
    try {
        chat = await getChatById(chatId);
        chat_messages = chat.messages;
    } catch (err) {
        return res.status(404).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
    const nextPage = `${req.path}?skip=${skip+limit}&limit=${limit}`;
    return res.status(200).json({ chat_messages, nextPage: nextPage });
});

/**
 *   /chats/:chatId/messages | POST | Add a message to the specified chat
 *   Returns the new message or an error 500
 */
router.post(
    '/chats/:chatId/messages',
    authenticateToken,
    retrieveChatId, 
    async (req: MessagePostRequest, res: Response) => {
        const chatId: Types.ObjectId = res.locals.chatId;
        let chat: ChatDocument;

        try {
            chat = await getChatById(chatId);
            chat.addMessage(req.body.content, req.body.timestamp, req.body.author);
        } catch (err) {
            return res.status(500).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }

        return res.status(200).json(req.body);
    }
);
