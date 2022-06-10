import { Types } from 'mongoose';

import {
    getApiCredentials,
    MongoDbApi,
    MongoDbSingleInsertResponse,
    MongoDpApiCredentials,
} from './mongodb-api';
import { User, UserRoles, UserStatus } from '../../../../src/model/user/user';
import { Chat } from '../../../../src/model/chat/chat';
import { LoginInfo } from '../../../src/app/core/api/handlers/auth-api';
import { apiAuthPassword, knownBcryptDigest } from './authentication';

/**
 * Returns data that represents a user in the db.
 * The username has to be unique to avoid conflicts,
 * the other data does not, so it is static.
 */
export const getUserData = (): User => {
    return {
        username: `username-${Date.now()}`,
        pwdHash: knownBcryptDigest.pwdHash,
        salt: knownBcryptDigest.pwdSalt,
        roles: [UserRoles.Base],
        status: UserStatus.Online,
        stats: {
            elo: 0,
            topElo: 0,
            wins: 0,
            losses: 0,
            shipsDestroyed: 0,
            totalShots: 0,
            totalHits: 0,
        },
        relationships: [],
        notifications: [],
    };
};

/**
 * Returns data that represents a chat in the db
 */
export const getChatData = (userId: Types.ObjectId): Chat => {
    return {
        users: [userId],
        messages: [
            {
                author: userId,
                timestamp: new Date(),
                content: 'content',
            },
        ],
    };
};

export interface SetupData {
    apiAuthCredentials: LoginInfo;
    insertedData: Object;
}

export interface ChatApiTestingSetupData extends SetupData {
    insertedData: {
        chatId: string;
        chatData: Chat;
        userId: string;
        userData: User;
    };
}

/**
 * Sets up the db for chat api testing and returns the setup data
 */
export const setupDbChatApiTesting = async (): Promise<ChatApiTestingSetupData> => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);

    const userData: User = getUserData();
    const insertUserRes: MongoDbSingleInsertResponse = await mongoDbApi.insertUser(userData);
    const userId: string = insertUserRes.insertedId;

    const chatData: Chat = getChatData(Types.ObjectId(userId));
    const insertedChatRes: MongoDbSingleInsertResponse = await mongoDbApi.insertChat(chatData);
    const chatId: string = insertedChatRes.insertedId;

    return {
        apiAuthCredentials: {
            username: userData.username,
            password: apiAuthPassword,
        },
        insertedData: {
            userId: userId,
            userData: userData,
            chatId: chatId,
            chatData: chatData,
        },
    };
};

export const teardownDbChatApiTesting = async (
    setupData: ChatApiTestingSetupData
): Promise<void> => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);

    await mongoDbApi.emptyChatCollection();
    await mongoDbApi.deleteUser(setupData.insertedData.userId);
};
