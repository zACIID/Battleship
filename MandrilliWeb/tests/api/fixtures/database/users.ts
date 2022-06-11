import { User, UserRoles, UserStatus } from '../../../../../src/model/user/user';
import {
    getApiCredentials,
    MongoDbApi,
    MongoDbSingleInsertResponse,
    MongoDpApiCredentials,
} from './mongodb-api';
import { knownBcryptDigest } from '../authentication';

/**
 * Returns data that represents a user in the db.
 * The username has to be unique to avoid conflicts,
 * the other data does not, so it is static.
 */
export const getUserData = (): User => {
    return {
        username: `username-${Date.now()}`,
        pwd_hash: knownBcryptDigest.pwdHash,
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

export interface InsertedUser {
    userId: string;
    userData: User;
}

export const insertUser = async (): Promise<InsertedUser> => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);

    const userData: User = getUserData();
    const insertUserRes: MongoDbSingleInsertResponse = await mongoDbApi.insertUser(userData);
    const userId: string = insertUserRes.insertedId;

    return {
        userId: userId,
        userData: userData,
    };
};

export const deleteUser = async (userId: string): Promise<void> => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);

    await mongoDbApi.deleteUser(userId);
};
