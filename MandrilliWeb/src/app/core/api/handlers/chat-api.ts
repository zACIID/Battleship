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
 * Class that handles communication with chat-related endpoints
 */
@Injectable({
    providedIn: 'root',
})
export class ChatApi extends BaseAuthenticatedApi {
    public constructor(httpClient: HttpClient, accessTokenProvider: JwtProvider) {
        super(httpClient, accessTokenProvider);
    }

    public getChat(chatId: string): Observable<Chat> {
        const reqPath: string = `${this.baseUrl}/api/chat/${chatId}`;

        return this.httpClient
            .get<ApiChat>(reqPath, this.createRequestOptions())
            .pipe(
                catchError(this.handleError),
                map<ApiChat, Chat>((apiChat: ApiChat) => {
                    return toChat(apiChat)
                })
            );
    }

    public deleteChat(chatId: string): Observable<void> {
        const reqPath: string = `${this.baseUrl}/api/chat/${chatId}`;

        return this.httpClient
            .delete<void>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public getMessages(chatId: string, skip: number, limit: number): Observable<Message[]> {
        const queryParams: string = `skip=${skip}&limit=${limit}`;
        const reqPath: string = `${this.baseUrl}/api/chat/${chatId}/messages?${queryParams}`;

        return this.httpClient
            .get<ApiMessage[]>(reqPath, this.createRequestOptions())
            .pipe(
                catchError(this.handleError),
                map<ApiMessage[], Message[]>((messages: ApiMessage[]) => {
                    return messages.map((m: ApiMessage) => {
                        return toMessage(m);
                    });
                })
            );
    }

    public addMessage(chatId: string, message: Message): Observable<Message> {
        const reqPath: string = `${this.baseUrl}/api/chat/${chatId}/users`;
        const reqBody: ApiMessage = toApiMessage(message);

        return this.httpClient
            .post<ApiMessage>(reqPath, reqBody, this.createRequestOptions())
            .pipe(
                catchError(this.handleError),
                map<ApiMessage, Message>((apiMessage: ApiMessage) => {
                    return toMessage(apiMessage);
                })
            );
    }

    public addUser(chatId: string, userId: string): Observable<AddUserResponse> {
        const reqPath: string = `${this.baseUrl}/api/chat/${chatId}/users`;

        return this.httpClient
            .post<AddUserResponse>(reqPath, userId, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }

    public removeUser(chatId: string, userId: string): Observable<void> {
        const reqPath: string = `${this.baseUrl}/api/chat/${chatId}/users/${userId}`;

        return this.httpClient
            .delete<void>(reqPath, this.createRequestOptions())
            .pipe(catchError(this.handleError));
    }
}
