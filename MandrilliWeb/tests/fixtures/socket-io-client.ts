import { SocketIoModule, Socket, SocketIoConfig } from 'ngx-socket-io';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../src/environments/environment';
import { ServerJoinedEmitter } from '../../src/app/core/events/emitters/server-joined';
import { ChatJoinedEmitter } from '../../src/app/core/events/emitters/chat-joined';
import { MatchJoinedEmitter } from '../../src/app/core/events/emitters/match-joined';
import { close } from 'fs';
import { ChatLeftEmitter } from '../../src/app/core/events/emitters/chat-left';
import { MatchLeftEmitter } from '../../src/app/core/events/emitters/match-left';

const sIoConfig: SocketIoConfig = {
    url: environment.apiBaseUrl,
    options: {},
};

export const injectSocketIoClient = (): Socket => {
    TestBed.configureTestingModule({
        imports: [SocketIoModule.forRoot(sIoConfig)],
        providers: [],
    });

    return TestBed.inject(Socket);
};

export const joinServer = (userId: string, client: Socket) => {
    const serverJoinedEmitter: ServerJoinedEmitter = new ServerJoinedEmitter(client);
    serverJoinedEmitter.emit({
        userId: userId,
    });
};

export const joinChat = (chatId: string, client: Socket) => {
    const chatJoinedEmitter: ChatJoinedEmitter = new ChatJoinedEmitter(client);
    chatJoinedEmitter.emit({
        chatId: chatId,
    });
};

export const leaveChat = (chatId: string, client: Socket) => {
    const chatLeftEmitter: ChatLeftEmitter = new ChatLeftEmitter(client);
    chatLeftEmitter.emit({
        chatId: chatId,
    });
};

export const joinMatch = (matchId: string, client: Socket) => {
    const matchJoinedEmitter: MatchJoinedEmitter = new MatchJoinedEmitter(client);
    matchJoinedEmitter.emit({
        matchId: matchId,
    });
};

export const leaveMatch = (matchId: string, client: Socket) => {
    const matchLeftEmitter: MatchLeftEmitter = new MatchLeftEmitter(client);
    matchLeftEmitter.emit({
        matchId: matchId,
    });
};
