import { Types } from 'mongoose';

import {
    getApiCredentials,
    MongoDbApi,
    MongoDbSingleInsertResponse,
    MongoDpApiCredentials,
} from './mongodb-api';
import { Chat } from '../../../../src/model/chat/chat';
import { apiAuthPassword, getCredentialsForUser } from '../authentication';
import { deleteUser, InsertedUser, insertUser } from './users';
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

/**
 * Sets up the db for chat api testing and returns the setup data
 */
export const setupDbChatApiTesting = async (): Promise<ChatApiTestingSetupData> => {
    const insertedUser: InsertedUser = await insertUser();
    const insertedChat: InsertedChat = await insertChat([insertedUser.userId as string]);

    return {
        apiAuthCredentials: getCredentialsForUser(insertedUser.userData.username),
        insertedData: {
            user: insertedUser,
            chat: insertedChat,
        },
    };
};

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

export const teardownDbChatApiTesting = async (
    setupData: ChatApiTestingSetupData
): Promise<void> => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);

    await mongoDbApi.emptyChatCollection();
    await deleteUser(setupData.insertedData.user.userId);
};
