import axios, { AxiosRequestConfig } from 'axios';

import * as dbUser from '../../../../src/model/user/user';
import * as dbMatch from '../../../../src/model/match/match';
import * as dbChat from '../../../../src/model/chat/chat';
import * as dbMatchmaking from '../../../../src/model/matchmaking/queue-entry';

// TODO the secret values are retrieved from the testing endpoint of the server api
const dbInfo = {
    url: 'TODO',
    apiKey: 'TODO',
    clusterName: 'TODO',
    userCollection: 'Users',
    matchCollection: 'Matches',
    chatCollection: 'Chats',
    matchmakingCollection: 'MatchmakingQueue',
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

interface MongoDbFilterReq extends MongoDbReqBody {
    /**
     * Filters for a query
     */
    filter: Object;

    // There could be other fields, but these are sufficient for my purposes
}

export class MongoDbApi {
    private readonly _clusterName: string;
    private readonly _dbName: string;

    public constructor(clusterName: string, dbName: string) {
        this._clusterName = clusterName;
        this._dbName = dbName;
    }

    /*
     * Get dbUser.User document by _id
     */
    public async getUserDocument(_id: string): Promise<dbUser.UserDocument> {
        return await this.getDocumentById<dbUser.UserDocument>(dbInfo.userCollection, _id);
    }

    /*
     * Get dbMatch.Match document by _id
     */
    public async getMatchDocument(_id: string): Promise<dbMatch.MatchDocument> {
        return await this.getDocumentById<dbMatch.MatchDocument>(dbInfo.matchCollection, _id);
    }

    /*
     * Get dbChat.Chat document by _id
     */
    public async getChatDocument(_id: string): Promise<dbChat.ChatDocument> {
        return await this.getDocumentById<dbChat.ChatDocument>(dbInfo.userCollection, _id);
    }

    /*
     * Get a document by _id from the specified collection
     */
    public async getDocumentById<T>(collectionName: string, _id: string): Promise<T> {
        const filter = {
            _id: _id,
        };

        return await this.getDocument<T>(filter, collectionName);
    }

    public async getQueueEntry(userId: string): Promise<dbMatchmaking.QueueEntryDocument> {
        const filter = {
            userId: userId,
        };

        return await this.getDocument<dbMatchmaking.QueueEntryDocument>(
            filter,
            dbInfo.matchmakingCollection
        );
    }

    public async getDocument<D>(filter: Object, collection: string): Promise<D> {
        const reqBody: MongoDbFilterReq = {
            dataSource: this._clusterName,
            database: this._dbName,
            collection: collection,
            filter: filter,
        };

        return await this.sendMongoDbRequest<D>({
            requestPath: '/action/findOne',
            body: reqBody,
        });
    }

    public async insertUser(userData: dbUser.User): Promise<dbUser.UserDocument> {
        return await this.insertDocument<dbUser.User, dbUser.UserDocument>(
            userData,
            dbInfo.userCollection
        );
    }

    public async insertChat(chatData: dbChat.Chat): Promise<dbChat.ChatDocument> {
        return await this.insertDocument<dbChat.Chat, dbChat.ChatDocument>(
            chatData,
            dbInfo.chatCollection
        );
    }

    public async insertMatch(matchData: dbMatch.Match): Promise<dbMatch.MatchDocument> {
        return await this.insertDocument<dbMatch.Match, dbMatch.MatchDocument>(
            matchData,
            dbInfo.matchCollection
        );
    }

    public async insertQueueEntry(
        entryData: dbMatchmaking.QueueEntry
    ): Promise<dbMatchmaking.QueueEntryDocument> {
        return await this.insertDocument<
            dbMatchmaking.QueueEntry,
            dbMatchmaking.QueueEntryDocument
        >(entryData, dbInfo.matchmakingCollection);
    }

    public async insertDocument<I, D>(insertData: I, collection: string): Promise<D> {
        const reqBody: MongoDbInsertReq<I> = {
            dataSource: this._clusterName,
            database: this._dbName,
            collection: collection,
            document: insertData,
        };

        return await this.sendMongoDbRequest<D>({
            requestPath: '/action/insertOne',
            body: reqBody,
        });
    }

    public async emptyDatabase(): Promise<void> {
        await this.emptyCollection(dbInfo.chatCollection);
    }

    public async emptyUserCollection(): Promise<void> {
        await this.emptyCollection(dbInfo.userCollection);
    }

    public async emptyChatCollection(): Promise<void> {
        await this.emptyCollection(dbInfo.chatCollection);
    }

    public async emptyMatchCollection(): Promise<void> {
        await this.emptyCollection(dbInfo.matchCollection);
    }

    public async emptyMatchmakingCollection(): Promise<void> {
        await this.emptyCollection(dbInfo.matchmakingCollection);
    }

    public async emptyCollection(collection: string): Promise<void> {
        const reqBody: MongoDbFilterReq = {
            dataSource: this._clusterName,
            database: this._dbName,
            collection: collection,
            filter: {},
        };

        // Response should contain something like "deletedCount: x"
        await this.sendMongoDbRequest<Object>({
            requestPath: '/action/deleteMany',
            body: reqBody,
        });
    }

    /*
     * Send a request to the MongoDb REST API with the specified parameters
     */
    public async sendMongoDbRequest<R>(reqParams: MongoDbReqParams): Promise<R> {
        try {
            const url: string = `${dbInfo.url}${reqParams.requestPath}`;
            const reqData: Object = reqParams.body;

            const reqHeaders = {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': dbInfo.apiKey,
            };
            const axiosReqConfig: AxiosRequestConfig = {
                headers: reqHeaders,
            };

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
}
