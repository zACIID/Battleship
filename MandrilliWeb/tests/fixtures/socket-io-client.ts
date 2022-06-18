import { SocketIoModule, Socket, SocketIoConfig } from 'ngx-socket-io';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import { environment } from '../../src/environments/environment';
import { ServerJoinedEmitter } from '../../src/app/core/events/emitters/server-joined';
import { ChatJoinedEmitter } from '../../src/app/core/events/emitters/chat-joined';
import { MatchJoinedEmitter } from '../../src/app/core/events/emitters/match-joined';
import { ChatLeftEmitter } from '../../src/app/core/events/emitters/chat-left';
import { MatchLeftEmitter } from '../../src/app/core/events/emitters/match-left';
import { JoinReason, MatchJoinedData } from '../../src/app/core/model/events/match-joined-data';
import { MatchLeftData } from '../../src/app/core/model/events/match-left-data';

const sIoConfig: SocketIoConfig = {
    url: environment.serverBaseUrl,
    options: {},
};

/**
 * Returns the necessary testbed configuration to inject SocketIo services
 */
export const socketIoTestbedConfig: TestModuleMetadata = {
    imports: [SocketIoModule.forRoot(sIoConfig)],
    providers: [],
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

export const joinMatch = (client: Socket, joinData: MatchJoinedData) => {
    const matchJoinedEmitter: MatchJoinedEmitter = new MatchJoinedEmitter(client);

    matchJoinedEmitter.emit(joinData);
};

export const leaveMatch = (client: Socket, leaveData: MatchLeftData) => {
    const matchLeftEmitter: MatchLeftEmitter = new MatchLeftEmitter(client);
    matchLeftEmitter.emit(leaveData);
};
