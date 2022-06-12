import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import * as dbUser from '../../../../src/model/user/user';
import * as dbMatch from '../../../../src/model/match/match';
import * as dbChat from '../../../../src/model/chat/chat';
import * as dbMatchmaking from '../../../../src/model/matchmaking/queue-entry';
import { environment } from '../../../src/environments/environment';
import { Document, FilterQuery, Types } from 'mongoose';

const dbCollectionNames = {
    userCollection: 'Users',
    matchCollection: 'Matches',
    chatCollection: 'Chats',
    matchmakingCollection: 'MatchmakingQueue',
};

export interface MongoDpApiCredentials {
    apiBaseUrl: string;
    clusterName: string;
    apiKey: string;
    dbName: string;
}

let apiCredentials: MongoDpApiCredentials | null = null;
export const getApiCredentials = async (): Promise<MongoDpApiCredentials> => {
    // Send the request only if necessary
    // Credentials are static, so there's no need to flood the server with requests
    if (apiCredentials !== null) {
        return apiCredentials;
    } else {
        const reqUrl: string = `${environment.apiBaseUrl}/api/testing/mongoDbApi/credentials`;

        const res: AxiosResponse<MongoDpApiCredentials> = await axios.get<MongoDpApiCredentials>(
            reqUrl
        );

        apiCredentials = res.data;

        return apiCredentials;
    }
};

interface MongoDbReqParams {
    requestPath: string;
    body: MongoDbReqBody;
}

interface MongoDbReqBody {
    /**
     * Cluster name
     */
    dataSource: string;

    /**
     * Database name
     */
    database: string;

    /**
     * Collection name
     */
    collection: string;
}

interface MongoDbInsertReq<D> extends MongoDbReqBody {
    /**
     * Document to send
     */
    document: D;
}

export interface MongoDbFilterReq extends MongoDbReqBody {
    /**
     * Filters for a query
     */
    filter: FilterQuery<Document>;

    // There could be other fields, but these are sufficient for my purposes
}

/**
 * Wrapper for actual ObjectIds that needs to be sent in order to tell
 * the MongoDb Data Api that the value is indeed an ObjectId
 */
interface RequestObjectId {
    $oid: string | Types.ObjectId;
}

export interface MongoDbSingleInsertResponse {
    insertedId: string;
}

export class MongoDbApi {
    private readonly _credentials: MongoDpApiCredentials;
    private readonly _verbose: boolean;

    public constructor(credentials: MongoDpApiCredentials, verbose: boolean = false) {
        this._credentials = credentials;
        this._verbose = verbose;
    }

    /*
     * Get user document by _id
     */
    public async getUserDocument(_id: string): Promise<dbUser.UserDocument> {
        return await this.getDocumentById<dbUser.UserDocument>(
            dbCollectionNames.userCollection,
            _id
        );
    }

    /*
     * Get match document by _id
     */
    public async getMatchDocument(_id: string): Promise<dbMatch.MatchDocument> {
        return await this.getDocumentById<dbMatch.MatchDocument>(
            dbCollectionNames.matchCollection,
            _id
        );
    }

    /*
     * Get chat document by _id
     */
    public async getChatDocument(_id: string): Promise<dbChat.ChatDocument> {
        return await this.getDocumentById<dbChat.ChatDocument>(
            dbCollectionNames.userCollection,
            _id
        );
    }

    /*
     * Get a document by _id from the specified collection
     */
    public async getDocumentById<T extends Document>(
        collectionName: string,
        _id: string
    ): Promise<T> {
        const filter: FilterQuery<Document> = {
            _id: MongoDbApi.convertToRequestObjId(_id),
        };

        return await this.getDocument<T>(filter, collectionName);
    }

    /**
     * Get matchmaking queue entry by user id
     * @param userId id of the user that the entry represents
     */
    public async getQueueEntry(userId: string): Promise<dbMatchmaking.QueueEntryDocument> {
        const filter = {
            userId: userId,
        };

        return await this.getDocument<dbMatchmaking.QueueEntryDocument>(
            filter,
            dbCollectionNames.matchmakingCollection
        );
    }

    public async getDocument<D extends Document>(
        filter: FilterQuery<Document>,
        collection: string
    ): Promise<D> {
        const reqBody: MongoDbFilterReq = {
            dataSource: this._credentials.clusterName,
            database: this._credentials.dbName,
            collection: collection,
            filter: filter,
        };

        return await this.sendMongoDbRequest<D>({
            requestPath: '/action/findOne',
            body: reqBody,
        });
    }

    public async insertUser(userData: dbUser.User): Promise<MongoDbSingleInsertResponse> {
        return await this.insertDocument<dbUser.User>(userData, dbCollectionNames.userCollection);
    }

    public async insertChat(chatData: dbChat.Chat): Promise<MongoDbSingleInsertResponse> {
        return await this.insertDocument<dbChat.Chat>(chatData, dbCollectionNames.chatCollection);
    }

    public async insertMatch(matchData: dbMatch.Match): Promise<MongoDbSingleInsertResponse> {
        return await this.insertDocument<dbMatch.Match>(
            matchData,
            dbCollectionNames.matchCollection
        );
    }

    public async insertQueueEntry(
        entryData: dbMatchmaking.QueueEntry
    ): Promise<MongoDbSingleInsertResponse> {
        return await this.insertDocument<dbMatchmaking.QueueEntry>(
            entryData,
            dbCollectionNames.matchmakingCollection
        );
    }

    public async insertDocument<I>(
        insertData: I,
        collection: string
    ): Promise<MongoDbSingleInsertResponse> {
        const reqBody: MongoDbInsertReq<I> = {
            dataSource: this._credentials.clusterName,
            database: this._credentials.dbName,
            collection: collection,
            document: insertData,
        };

        return await this.sendMongoDbRequest<MongoDbSingleInsertResponse>({
            requestPath: '/action/insertOne',
            body: reqBody,
        });
    }

    public async emptyDatabase(): Promise<void> {
        await this.emptyCollection(dbCollectionNames.chatCollection);
    }

    public async emptyUserCollection(): Promise<void> {
        await this.emptyCollection(dbCollectionNames.userCollection);
    }

    public async emptyChatCollection(): Promise<void> {
        await this.emptyCollection(dbCollectionNames.chatCollection);
    }

    public async emptyMatchCollection(): Promise<void> {
        await this.emptyCollection(dbCollectionNames.matchCollection);
    }

    public async emptyMatchmakingCollection(): Promise<void> {
        await this.emptyCollection(dbCollectionNames.matchmakingCollection);
    }

    private async emptyCollection(collection: string): Promise<void> {
        const reqBody: MongoDbFilterReq = {
            dataSource: this._credentials.clusterName,
            database: this._credentials.dbName,
            collection: collection,
            filter: {},
        };

        // Response should contain something like "deletedCount: x"
        await this.sendMongoDbRequest<Object>({
            requestPath: '/action/deleteMany',
            body: reqBody,
        });
    }

    /**
     * Deletes the user with the provided id from the database
     * @param _id
     */
    public async deleteUser(_id: string): Promise<void> {
        return await this.deleteDocument(
            {
                _id: MongoDbApi.convertToRequestObjId(_id),
            },
            dbCollectionNames.userCollection
        );
    }

    /**
     * Deletes the chat with the provided id from the database
     * @param _id
     */
    public async deleteChat(_id: string): Promise<void> {
        return await this.deleteDocument(
            {
                _id: MongoDbApi.convertToRequestObjId(_id),
            },
            dbCollectionNames.chatCollection
        );
    }

    /**
     * Deletes the match with the provided id from the database
     * @param _id
     */
    public async deleteMatch(_id: string): Promise<void> {
        return await this.deleteDocument(
            {
                _id: MongoDbApi.convertToRequestObjId(_id),
            },
            dbCollectionNames.matchCollection
        );
    }

    /**
     * Deletes the matchmaking queue entry of the user
     * with the provided id from the database
     * @param userId
     */
    public async deleteQueueEntry(userId: string): Promise<void> {
        return await this.deleteDocument(
            {
                userId: userId,
            },
            dbCollectionNames.matchmakingCollection
        );
    }

    /**
     * Deletes a document based on the provided filter
     * @param filter
     * @param collection
     */
    public async deleteDocument(filter: FilterQuery<Document>, collection: string): Promise<void> {
        const reqBody: MongoDbFilterReq = {
            dataSource: this._credentials.clusterName,
            database: this._credentials.dbName,
            collection: collection,
            filter: filter,
        };

        // Response should contain something like "deletedCount: x"
        await this.sendMongoDbRequest<Object>({
            requestPath: '/action/deleteOne',
            body: reqBody,
        });
    }

    /*
     * Send a request to the MongoDb REST API with the specified parameters
     */
    private async sendMongoDbRequest<R>(reqParams: MongoDbReqParams): Promise<R> {
        try {
            const url: string = `${this._credentials.apiBaseUrl}${reqParams.requestPath}`;
            const reqData: Object = reqParams.body;

            const reqHeaders = {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': this._credentials.apiKey,
            };
            const axiosReqConfig: AxiosRequestConfig = {
                headers: reqHeaders,
            };

            this.logRequest(reqParams);

            const res = await axios.post<R>(url, reqData, axiosReqConfig);
            return res.data;
        } catch (err) {
            if (err instanceof Error) {
                console.log('Error has occurred in MongoDbApi');
                console.log(err.message);
            }

            throw err;
        }
    }

    private logRequest(reqParams: MongoDbReqParams) {
        // Do not log if not verbose
        if (!this._verbose) {
            return;
        }

        console.log('[MongoDbApi] Request sent:');
        console.log(reqParams);
    }

    private static convertToRequestObjId(objId: string | Types.ObjectId): RequestObjectId {
        return {
            $oid: objId,
        };
    }
}
