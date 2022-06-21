import { Router, Response } from 'express';
import { Types } from 'mongoose';

import { ChatDocument, getChatById, deleteChat } from '../model/database/chat/chat';
import { MessageSubDocument } from '../model/database/chat/message';
import { authenticateToken } from './auth-routes';
import {
    skipLimitChecker,
    retrieveChatId,
    retrieveId,
    retrieveUserId,
} from './utils/param-checking';
import { ioServer } from '../index';
import { ChatMessageEmitter } from '../events/emitters/chat-message';
import { AuthenticatedRequest } from './utils/authenticated-request';
import { fromUnixSeconds, toUnixSeconds } from './utils/date-utils';

export const router = Router();

interface ChatEndpointLocals {
    chatId: Types.ObjectId;
    userId: Types.ObjectId;
    skip: number;
    limit: number;
}

interface ChatEndpointResponse extends Response {
    locals: ChatEndpointLocals;
}

interface UserPostBody {
    userId: string;
}

interface UserPostRequest extends AuthenticatedRequest {
    body: UserPostBody;
}

interface ResponseMessage {
    author: string;
    content: string;
    timestamp: number;
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
    async (req: AuthenticatedRequest, res: ChatEndpointResponse) => {
        const chatId: Types.ObjectId = res.locals.chatId;

        let chat: ChatDocument;

        try {
            chat = await getChatById(chatId);
        } catch (err) {
            return res.status(404).json({
                timestamp: toUnixSeconds(new Date()),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }

        return res.status(200).json({
            chatId: chat._id,
            users: chat.users,
            messages: chat.messages.map((m: MessageSubDocument): ResponseMessage => {
                return {
                    author: m.author.toString(),
                    content: m.content,
                    timestamp: m.timestamp.getTime() / 1000,
                };
            }),
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
    async (req: AuthenticatedRequest, res: ChatEndpointResponse) => {
        const chatId: Types.ObjectId = res.locals.chatId;

        await deleteChat(chatId).catch((err: Error) => {
            return res.status(404).json({
                timestamp: toUnixSeconds(new Date()),
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
                timestamp: toUnixSeconds(new Date()),
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
    async (req: AuthenticatedRequest, res: ChatEndpointResponse) => {
        const chatId: Types.ObjectId = res.locals.chatId;
        const userId: Types.ObjectId = res.locals.userId;
        let chat: ChatDocument;
        try {
            chat = await getChatById(chatId);
            await chat.removeUser(userId);
        } catch (err) {
            return res.status(404).json({
                timestamp: toUnixSeconds(new Date()),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
        return res.status(204).json({});
    }
);

interface MessagePostBody {
    author: string;
    content: string;
    timestamp: number;
}

interface MessagePostRequest extends AuthenticatedRequest {
    body: MessagePostBody;
}

/**
 *  /chats/:chatId/messages?skip=&limit= | GET | Retrieve the messages of the specified chat
 *  Query params: skip, limit
 */
router.get(
    '/chats/:chatId/messages',
    authenticateToken,
    // TODO skipLimitChecker could be a function that accepts default values for skip and limit and
    //  returns a middleware function based on those
    skipLimitChecker,
    retrieveChatId,
    async (req: AuthenticatedRequest, res: ChatEndpointResponse) => {
        try {
            const chatId: Types.ObjectId = res.locals.chatId;

            // If parameters are not passed,
            // they are assigned the value -1 by the middleware
            let skip: number = res.locals.skip;
            let limit: number = res.locals.limit;

            // Set default value for skip
            if (skip === -1) {
                skip = 0;
            }

            // Set default value for limit
            if (limit === -1) {
                limit = 50;
            }

            const chat: ChatDocument = await getChatById(chatId);
            const resMessages: ResponseMessage[] = chat.messages.map((m: MessageSubDocument) => {
                return {
                    author: m.author.toString(),
                    content: m.content,
                    timestamp: m.timestamp.getTime() / 1000,
                };
            });

            // Sort messages by most recent timestamp (bigger = first)
            resMessages.sort((a: ResponseMessage, b: ResponseMessage) => {
                const timeA = fromUnixSeconds(a.timestamp);
                const timeB = fromUnixSeconds(b.timestamp);

                if (timeA < timeB) {
                    return 1;
                } else if (timeA > timeB) {
                    return -1;
                } else {
                    return 0;
                }
            });

            // Apply pagination params
            let paginatedMessages: ResponseMessage[] = resMessages.slice(skip, skip + limit);

            const nextPage = `${req.path}?skip=${skip + limit}&limit=${limit}`;
            return res.status(200).json({
                messages: paginatedMessages,
                nextPage: nextPage,
            });
        } catch (err) {
            return res.status(404).json({
                timestamp: toUnixSeconds(new Date()),
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
            const { author, timestamp, content } = req.body;

            const authorId: Types.ObjectId = Types.ObjectId(author);
            const msgDate: Date = new Date(timestamp * 1000);
            await chat.addMessage(content, msgDate, authorId);

            // Notify users in the chat with the message sent
            const messageNotifier: ChatMessageEmitter = new ChatMessageEmitter(ioServer, chatId);
            messageNotifier.emit({
                author: authorId.toString(),
                content: content,
                timestamp: Math.floor(msgDate.getTime() / 1000),
            });

            return res.status(201).json(req.body);
        } catch (err) {
            return res.status(400).json({
                timestamp: toUnixSeconds(new Date()),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);
