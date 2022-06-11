import { Types } from 'mongoose';

import {
    getApiCredentials,
    MongoDbApi,
    MongoDbSingleInsertResponse,
    MongoDpApiCredentials,
} from './mongodb-api';
import { Chat } from '../../../../../src/model/chat/chat';
import { getUserData} from './users';
import { apiAuthPassword } from '../authentication';
import { deleteUser, InsertedUser, insertUser } from './users';
import { SetupData } from '../utils';
import { User, UserRoles } from '../../../../../src/model/user/user';


export const insertModerator: () => Promise<InsertedUser> = async () => {
    const userData: User = getUserData()
    userData.roles.push(UserRoles.Moderator)
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);
    const insertUserRes: MongoDbSingleInsertResponse = await mongoDbApi.insertUser(userData);
    const userId: string = insertUserRes.insertedId;
    return Promise.resolve({
        userId: userId,
        userData: userData,
    });
}

export const deleteModerator: (id:string) => Promise<void> = async(moderatorId: string) => {
    return deleteUser(moderatorId)
}