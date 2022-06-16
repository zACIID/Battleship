import {
    getApiCredentials,
    MongoDbApi,
    MongoDpApiCredentials,
} from '../database/mongodb-api/mongodb-api';

export const insertRelationship = async (selfId: string, friendId: string, chatId: string) => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);
    try {
        await mongoDbApi.insertRelationship(selfId, friendId, chatId);
    } catch(err) {
        throw err
    }
};

export const deleteRelationship = async (selfId: string, friendId: string) => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);
    try {
        await mongoDbApi.deleteRelationship(selfId, friendId);
    } catch(err) {
        throw err
    }
};
