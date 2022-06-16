import { RequestObjectId } from './mongodb-api';
import { Chat } from '../../../../../src/model/chat/chat';
import { Types } from 'mongoose';
import { Message } from '../../../../../src/model/chat/message';

/**
 * Interface that models chat message data, accounting for the fact
 * that MongoDb Data Api needs an $oid wrapper on ObjectIds
 */
export interface MongoDbApiMessage {
    author: RequestObjectId;
    timestamp: Date;
    content: string;
}

/**
 * Interface that models chat data, accounting for the fact
 * that MongoDb Data Api needs an $oid wrapper on ObjectIds
 */
export interface MongoDbApiChat {
    users: RequestObjectId[];
    messages: MongoDbApiMessage[];
}

export const toMongoDbApiChat = (chat: Chat): MongoDbApiChat => {
    return {
        users: chat.users.map((uId) => new RequestObjectId(uId)),
        messages: chat.messages.map(toMongoDbApiMessage),
    };
};

export const toMongoDbApiMessage = (msg: Message): MongoDbApiMessage => {
    return {
        author: new RequestObjectId(msg.author),
        timestamp: msg.timestamp,
        content: msg.content,
    };
};
