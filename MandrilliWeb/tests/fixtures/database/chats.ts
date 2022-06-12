import { Types } from 'mongoose';

import {
    DocId,
    getApiCredentials,
    MongoDbApi,
    MongoDbSingleInsertResponse,
    MongoDpApiCredentials,
} from './mongodb-api';
import { Chat } from '../../../../src/model/chat/chat';
import { InsertedUser } from './users';
import { SetupData } from '../utils';

/**
 * Returns data that represents a chat in the db
 */
export const getChatData = (userIds: string[]): Chat => {
    return {
        users: userIds.map((uId) => Types.ObjectId(uId)),
        messages: [
            {
                author: Types.ObjectId(userIds[0]),
                timestamp: new Date(),
                content: 'content',
            },
        ],
    };
};

export interface InsertedChat {
    chatId: string;
    chatData: Chat;
}

export interface ChatApiTestingSetupData extends SetupData {
    insertedData: {
        chat: InsertedChat;
        user: InsertedUser;
    };
}

export const insertChat = async (chatUserIds: string[]): Promise<InsertedChat> => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);

    const chatData: Chat = getChatData(chatUserIds);
    const insertedChatRes: MongoDbSingleInsertResponse = await mongoDbApi.insertChat(chatData);
    const chatId: string = insertedChatRes.insertedId;

    return {
        chatId: chatId,
        chatData: chatData,
    };
};

export const deleteChat = async (chatId: DocId): Promise<void> => {
    return deleteMultipleChats([chatId]);
};

export const deleteMultipleChats = async (chatIds: DocId[]): Promise<void> => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);

    await mongoDbApi.deleteMultipleChats(chatIds);
};
