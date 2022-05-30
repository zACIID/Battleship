/**
 * Interface that represents a Chat resource sent by the api
 */
import { BaseAuthenticatedApi } from './base-api';
import { Chat } from '../model/chat/chat';
import { Message } from '../model/chat/message';

/**
 * Interface that mimics what the api responds with after
 * a request on a chat endpoint
 */
export interface ApiChat {
    /**
     * Id of the chat
     */
    chatId: string;

    /**
     * Ids of the users involved in the chat
     */
    users: string[];

    /**
     * Messages exchanged in the chat
     */
    messages: ApiMessage[]
}

/**
 * Interface that represents a Message resource sent by the api
 */
export interface ApiMessage {
    /**
     * Id of the user that sent this message
     */
    author: string;

    /**
     * Time (in Unix seconds) that the message was sent at
     */
    timestamp: number;

    /**
     * Content of the message
     */
    content: string;
}

/**
 * Class that handles communication with chat-related endpoints
 */
export class ChatApi extends BaseAuthenticatedApi {
    public constructor(baseUrl: string, authToken: string) {
        super(baseUrl, authToken);
    }

    public getChat(chatId: string): Chat {
        const reqPath: string = `/api/chat/${chatId}`;

        throw new Error("Not Implemented");
    }

    public deleteChat(chatId: string): boolean {
        const reqPath: string = `/api/chat/${chatId}`;

        throw new Error("Not Implemented");
    }

    public getMessages(chatId: string, skip: number, limit: number): Message[] {
        const reqPath: string = `/api/chat/${chatId}/messages`;

        throw new Error("Not Implemented");
    }

    public addMessage(chatId: string, message: Message): boolean {
        const reqPath: string = `/api/chat/${chatId}/users`;

        throw new Error("Not Implemented");
    }

    public addUser(chatId: string, userId: string): boolean {
        const reqPath: string = `/api/chat/${chatId}/users`;

        throw new Error("Not Implemented");
    }

    public removeUser(chatId: string, userId: string): boolean {
        const reqPath: string = `/api/chat/${chatId}/users/${userId}`;

        throw new Error("Not Implemented");
    }
}
