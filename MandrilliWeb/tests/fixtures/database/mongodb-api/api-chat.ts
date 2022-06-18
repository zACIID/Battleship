import { ApiObjectId } from './mongodb-api';
import { Chat } from '../../../../../src/model/database/chat/chat';
import { Types } from 'mongoose';
import { Message } from '../../../../../src/model/database/chat/message';

/**
 * Interface that models chat message data, accounting for the fact
 * that MongoDb Data Api needs an $oid wrapper on ObjectIds
 */
export interface MongoDbApiMessage {
    author: ApiObjectId;
    timestamp: Date;
    content: string;
}

/**
 * Interface that models chat data, accounting for the fact
 * that MongoDb Data Api needs an $oid wrapper on ObjectIds
 */
export interface MongoDbApiChat {
    users: ApiObjectId[];
    messages: MongoDbApiMessage[];
}

export const toMongoDbApiChat = (chat: Chat): MongoDbApiChat => {
    return {
        users: chat.users.map((uId) => new ApiObjectId(uId)),
        messages: chat.messages.map(toMongoDbApiMessage),
    };
};

export const toMongoDbApiMessage = (msg: Message): MongoDbApiMessage => {
    return {
        author: new ApiObjectId(msg.author),
        timestamp: msg.timestamp,
        content: msg.content,
    };
};
