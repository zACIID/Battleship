import { User, UserRoles, UserStatus } from '../../../../src/model/database/user/user';
import {
    DocId,
    getApiCredentials,
    MongoDbApi,
    MongoDbSingleInsertResponse,
    MongoDpApiCredentials,
} from './mongodb-api/mongodb-api';
import { knownBcryptDigest } from '../authentication';
import { randomInt } from 'crypto';

/**
 * Returns data that represents a user in the db.
 * The username has to be unique to avoid conflicts,
 * the other data does not, so it is static.
 */
export const getUserData = (): User => {
    return {
        username: `username-${randomInt(100000)}-${Date.now()}`,
        pwd_hash: knownBcryptDigest.pwdHash,
        salt: knownBcryptDigest.pwdSalt,
        roles: [UserRoles.Base],
        status: UserStatus.Offline,
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

export interface InsertedUser {
    userId: string;
    userData: User;
}

export const insertUser = async (userData?: User): Promise<InsertedUser> => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);

    userData = userData ? userData : getUserData();
    const insertUserRes: MongoDbSingleInsertResponse = await mongoDbApi.insertUser(userData);
    const userId: string = insertUserRes.insertedId.toString();

    return {
        userId: userId,
        userData: userData,
    };
};

export const deleteUser = async (userId: DocId): Promise<void> => {
    return deleteMultipleUsers([userId]);
};

export const deleteMultipleUsers = async (userIds: DocId[]): Promise<void> => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);

    await mongoDbApi.deleteMultipleUsers(userIds);
};
