import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';

import { BaseAuthenticatedApi } from './base/base-authenticated-api';
import { JwtProvider } from '../jwt-auth/jwt-provider';
import { Chat } from '../../model/chat/chat';
import { Message } from '../../model/chat/message';
import { ApiChat, toChat } from '../../model/api/chat/api-chat';
import { ApiMessage, toApiMessage, toMessage } from '../../model/api/chat/api-message';

/**
 * Interface that represents a response from the Add User endpoint
 */
interface AddUserResponse {
    userId: string;
}

/**
 * Interface that represents a response from the Get Messages endpoint
 */
interface GetMessagesResponse {
    messages: ApiMessage[];
    nextPage: string;
}

/**
 * Class that handles communication with chat-related endpoints
 */
@Injectable({
    providedIn: 'root',
})
export class ChatApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: JwtProvider) {
        super(httpClient, accessTokenProvider);
    }

    /**
     * Retrieves the specified chat
     * @param chatId id of the chat to retrieve
     */
    public getChat(chatId: string): Observable<Chat> {
        const reqPath: string = `${this.baseUrl}/api/chats/${chatId}`;

        return this.httpClient.get<ApiChat>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError),
            map<ApiChat, Chat>((apiChat: ApiChat) => {
                return toChat(apiChat);
            })
        );
    }

    /**
     * Deletes the specified chat
     * @param chatId id of the chat to delete
     */
    public deleteChat(chatId: string): Observable<void> {
        const reqPath: string = `${this.baseUrl}/api/chats/${chatId}`;

        return this.httpClient
            .delete<void>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    /**
     * Retrieves the specified set of messages from the chat.
     * Skip and limit are used to handle the pagination of messages, which are
     * ordered based on the most recent.
     * @param chatId id of the chat to get the messages from
     * @param skip number of the messages, from the start, to skip
     * @param limit number of messages to retrieve
     */
    public getMessages(chatId: string, skip?: number, limit?: number): Observable<Message[]> {
        
        // Add query only if both skip and limit are defined
        const areQueryParamsUndefined: boolean = skip === undefined || limit === undefined;
        const query: string = !areQueryParamsUndefined ? `?skip=${skip}&limit=${limit}` : '';

        const reqPath: string = `${this.baseUrl}/api/chats/${chatId}/messages${query}`;
        
        return this.httpClient.get<GetMessagesResponse>(reqPath, this.createRequestOptions()).pipe(
            catchError(this.handleError),
            map<GetMessagesResponse, Message[]>((res: GetMessagesResponse) => {
                return res.messages.map((m: ApiMessage) => {
                    return toMessage(m);
                });
            })
        );
    }

    /**
     * Adds the specified message to the chat and returns it as proof that it was added.
     * @param chatId id of the chat to add the message to
     * @param message message to add
     */
    public addMessage(chatId: string, message: Message): Observable<Message> {
        const reqPath: string = `${this.baseUrl}/api/chats/${chatId}/messages`;
        const reqBody: ApiMessage = toApiMessage(message);

        return this.httpClient.post<ApiMessage>(reqPath, reqBody, this.createRequestOptions()).pipe(
            catchError(this.handleError),
            map<ApiMessage, Message>((apiMessage: ApiMessage) => {
                return toMessage(apiMessage);
            })
        );
    }

    /**
     * Adds the specified user to the chat and returns the userId as proof that it was added.
     * @param chatId id of the chat to add the user to
     * @param userId id of the user to add
     */
    public addUser(chatId: string, userId: string): Observable<string> {
        const reqPath: string = `${this.baseUrl}/api/chats/${chatId}/users`;
        const reqBody = {
            userId: userId,
        };

        return this.httpClient
            .post<AddUserResponse>(reqPath, reqBody, this.createRequestOptions())
            .pipe(
                catchError(this.handleError),
                map<AddUserResponse, string>((res: AddUserResponse) => {
                    return res.userId;
                })
            );
    }

    /**
     * Removes the specified user from the chat
     * @param chatId id of the chat to remove the user from
     * @param userId id of the user to remove
     */
    public removeUser(chatId: string, userId: string): Observable<void> {
        const reqPath: string = `${this.baseUrl}/api/chats/${chatId}/users/${userId}`;

        return this.httpClient
            .delete<void>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }
}
