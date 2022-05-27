import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';

import { ChatDocument, getChatById, deleteChat } from '../models/chat/chat';
import { Message } from '../models/chat/message';
import { authenticateToken } from './auth-routes';
import {
    skipLimitChecker,
    retrieveChatId,
    retrieveId,
    retrieveUserId,
} from './utils/param-checking';
import { API_BASE_URL, app } from '../index';

export const router = Router();

interface ChatEndpointLocals {
    chatId: Types.ObjectId;
    userId: Types.ObjectId;
    skip: string;
    limit: string;
}

interface ChatEndpointResponse extends Response {
    locals: ChatEndpointLocals;
}

interface UserPostBody {
    userId: string;
}

interface UserPostRequest extends Request {
    body: UserPostBody;
}

const userErr: string = 'No user with that identifier';

/**
 *   /chats/:chatId | GET | Retrieve the chat with the specified id
 *   Return the entire chat object or a 404 error if chat is not found
 */
router.get(
    '/chats/:chatId',
    authenticateToken,
    retrieveChatId,
    async (req: Request, res: ChatEndpointResponse) => {
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
        return res.status(200).json({
            chatId: chat._id,
            users: chat.users,
            messages: chat.messages,
        });
    }
);

/**
 *   /chats/:chatId | DELETE | Delete the chat with the provided id
 *   Returns an empty response or an error 404 if something went wrong
 */
router.delete(
    '/chats/:chatId',
    authenticateToken,
    retrieveChatId,
    async (req: Request, res: ChatEndpointResponse) => {
        const chatId: Types.ObjectId = res.locals.chatId;

        await deleteChat(chatId).catch((err: Error) => {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        });

        return res.status(204).json();
    }
);

/**
 *   /chats/:chatId/users | POST | Add the user with the provided id (in the request body) to the specified chat |
 */
router.post(
    '/chats/:chatId/users',
    authenticateToken,
    retrieveChatId,
    async (req: UserPostRequest, res: ChatEndpointResponse) => {
        const chatId: Types.ObjectId = res.locals.chatId;
        let userId: Types.ObjectId;
        let chat: ChatDocument;
        try {
            userId = retrieveId(req.body.userId);
            chat = await getChatById(chatId);
            await chat.addUser(userId);
        } catch (err) {
            const code: number = err.message === userErr ? 404 : 400;
            return res.status(code).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
        return res.status(201).json({ userId: req.body.userId });
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
    async (req: Request, res: ChatEndpointResponse) => {
        const chatId: Types.ObjectId = res.locals.chatId;
        const userId: Types.ObjectId = res.locals.userId;
        let chat: ChatDocument;
        try {
            chat = await getChatById(chatId);
            await chat.removeUser(userId);
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
        return res.status(204).json({});
    }
);

interface MessagePostBody {
    author: Types.ObjectId;
    content: string;
    timestamp: Date;
}

interface MessagePostRequest extends Request {
    body: MessagePostBody;
}

/**
 *  /chats/:chatId/messages | GET | Retrieve the messages of the specified chat
 */
router.get(
    '/chats/:chatId/messages',
    authenticateToken,
    skipLimitChecker,
    retrieveChatId,
    async (req: Request, res: ChatEndpointResponse) => {
        try {
            const chatId: Types.ObjectId = res.locals.chatId;
            const skip: number = parseInt(res.locals.skip as string);
            const limit: number = parseInt(res.locals.limit as string);
            console.log('limit:');
            console.log(limit);
            console.log('skip');
            console.log(skip);
            const chat: ChatDocument = await getChatById(chatId);
            const messages: Message[] = chat.messages;

            const nextPage = `${req.path}?skip=${skip + limit}&limit=${limit}`;
            return res.status(200).json({ messages, nextPage: nextPage });
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

/**
 *   /chats/:chatId/messages | POST | Add a message to the specified chat
 *   Returns the new message or an error 500
 */
router.post(
    '/chats/:chatId/messages',
    authenticateToken,
    retrieveChatId,
    async (req: MessagePostRequest, res: ChatEndpointResponse) => {
        try {
            const chatId: Types.ObjectId = res.locals.chatId;
            const chat: ChatDocument = await getChatById(chatId);

            await chat.addMessage(req.body.content, req.body.timestamp, req.body.author);

            return res.status(200).json(req.body);
        } catch (err) {
            return res.status(500).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

// Register endpoints
app.use(API_BASE_URL, router);
