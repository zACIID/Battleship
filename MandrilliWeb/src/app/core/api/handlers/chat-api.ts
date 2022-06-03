import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { AccessTokenProvider } from '../access/access-token-provider';
import { Chat } from '../../model/chat/chat';
import { Message } from '../../model/chat/message';
import { toUnixSeconds } from '../utils/date';


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
 * Interface that represents a response from the Add User endpoint
 */
interface AddUserResponse {
    userId: string
}

/**
 * Class that handles communication with chat-related endpoints
 */
@Injectable({
    providedIn: "root"
})
export class ChatApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: AccessTokenProvider) {
        super(httpClient, accessTokenProvider);
    }

    public getChat(chatId: string): Observable<Chat> {
        const reqPath: string = `/api/chat/${chatId}`;

        // TODO manipolare l'observable in modo che converta il messaggio da ApiChat a Chat
        return this.httpClient.get<ApiChat>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }

    public deleteChat(chatId: string): Observable<void> {
        const reqPath: string = `/api/chat/${chatId}`;

        return this.httpClient.delete<void>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }

    public getMessages(chatId: string, skip: number, limit: number): Observable<Message[]> {
        const queryParams: string = `skip=${skip}&limit=${limit}`;
        const reqPath: string = `/api/chat/${chatId}/messages?${queryParams}`;

        // TODO manipolare l'observable in modo che converta il messaggio da ApiMessage a Message
        return this.httpClient.get<ApiMessage[]>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }

    public addMessage(chatId: string, message: Message): Observable<Message> {
        const reqPath: string = `/api/chat/${chatId}/users`;
        const reqBody: ApiMessage = {
            author: message.author,
            timestamp: toUnixSeconds(message.timestamp),
            content: message.content
        }

        // TODO manipolare l'observable in modo che converta il messaggio da ApiMessage a Message
        return this.httpClient.post<ApiMessage>(reqPath, reqBody, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }

    public addUser(chatId: string, userId: string): Observable<AddUserResponse> {
        const reqPath: string = `/api/chat/${chatId}/users`;

        return this.httpClient.post<AddUserResponse>(reqPath, userId, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }

    public removeUser(chatId: string, userId: string): Observable<void> {
        const reqPath: string = `/api/chat/${chatId}/users/${userId}`;

        return this.httpClient.delete<void>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError)
        )
    }
}
