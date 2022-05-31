/**
 * Interface that represents a Chat resource sent by the api
 */
import { BaseAuthenticatedApi } from './base-api';
import { Chat } from '../model/chat/chat';
import { Message } from '../model/chat/message';
import {handleError, createOptions} from '../handler/ErrorsNdHeaders'
import { Observable, throwError, catchError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';


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

    private authToken: string;
    public constructor(baseUrl: string, authToken: string, private http: HttpClient) {
        super(baseUrl, authToken);
        this.authToken = authToken
    }

    public getChat(chatId: string): Observable<Chat> {
        const reqPath: string = `/api/chat/${chatId}`;
        return this.http.get<Chat>(reqPath, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public deleteChat(chatId: string): Observable<void> {
        const reqPath: string = `/api/chat/${chatId}`;
        return this.http.delete<void>(reqPath, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public getMessages(chatId: string, skip: number, limit: number): Observable<Message[]> {
        const reqPath: string = `/api/chat/${chatId}/messages`;
        return this.http.get<Message[]>(reqPath, createOptions({skip: skip, limit: limit}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public addMessage(chatId: string, message: Message): Observable<Message> {
        const reqPath: string = `/api/chat/${chatId}/users`;
        return this.http.post<Message>(reqPath, message, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public addUser(chatId: string, userId: string): Observable<{userId: string}> {
        const reqPath: string = `/api/chat/${chatId}/users`;
        return this.http.post<{userId: string}>(reqPath, userId, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        )
    }

    public removeUser(chatId: string, userId: string): Observable<void> {
        const reqPath: string = `/api/chat/${chatId}/users/${userId}`;
        return this.http.delete<void>(reqPath, createOptions({}, this.authToken)).pipe(
            catchError(handleError)
        ) 
    }
}
