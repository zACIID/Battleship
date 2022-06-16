import {
    getApiCredentials,
    MongoDbApi,
    MongoDpApiCredentials,
} from '../database/mongodb-api/mongodb-api';

export const insertRelationship = async (friendId: string, chatId: string) => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);

    // TODO also here
    // await mongoDbApi.insertRelationship(friendId, chatId);

    // TODO
    throw Error(
        'Not implemented. Probably need to add a MongoDbApi method that allows for document update'
    );
};
