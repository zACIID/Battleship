import { Types } from 'mongoose';
import {
    DocId,
    getApiCredentials,
    MongoDbApi,
    MongoDbSingleInsertResponse,
    MongoDpApiCredentials,
} from './mongodb-api';
import { deleteMultipleUsers, getUserData, InsertedUser, insertUser } from './users';
import { User } from '../../../../src/model/user/user';
import { BattleshipGrid } from 'src/app/core/model/match/battleship-grid';
import { deleteMultipleChats } from './chats';
import { ShipTypes } from '../../../../src/model/match/state/ship';

export interface UserMatches {
    userInfo: { userId: string; username: string };
    matchIds: string[];
}

let apiCred: MongoDpApiCredentials;
let userID: string = '';
let mongoDbApi: MongoDbApi;
let firstPlayer: InsertedUser;
let secondPlayer: InsertedUser;
let userObserver: InsertedUser;
let playerArray: Types.ObjectId[];
let playerChat: MongoDbSingleInsertResponse;
let observerChat: MongoDbSingleInsertResponse;
let match: MongoDbSingleInsertResponse;
let repeatUser: User;
let userBody: InsertedUser;
let playerGrid: BattleshipGrid = {
    ships: [
        {
            coordinates: [
                {
                    row: 0,
                    col: 0,
                },
                {
                    row: 0,
                    col: 1,
                },
                {
                    row: 0,
                    col: 2,
                },
            ],
            type: 'cruiser',
        },
    ],
    shotsReceived: [],
};

export const setupDbMatchApiTesting = async (userData?: User): Promise<string> => {
    apiCred = await getApiCredentials();
    mongoDbApi = new MongoDbApi(apiCred);
    if (userData) {
        if ((userID = '')) userID = (await mongoDbApi.insertUser(userData)).insertedId;
        userBody = {
            userId: userID,
            userData: userData,
        };
    }
    firstPlayer = userData ? await insertUser() : userBody;
    secondPlayer = await insertUser();
    userObserver = await insertUser();
    playerArray = [Types.ObjectId(firstPlayer.userId), Types.ObjectId(secondPlayer.userId)];
    playerChat = await mongoDbApi.insertChat({ users: playerArray, messages: [] });
    observerChat = await mongoDbApi.insertChat({
        users: [Types.ObjectId(userObserver.userId)],
        messages: [],
    });
    match = await mongoDbApi.insertMatch({
        player1: {
            playerId: playerArray[0],
            grid: {
                ships: [{ coordinates: playerGrid.ships[0].coordinates, type: ShipTypes.Cruiser }],
                shotsReceived: [],
            },
            isReady: false,
        },
        player2: {
            playerId: playerArray[1],
            grid: { ships: [], shotsReceived: [] },
            isReady: false,
        },
        playersChat: Types.ObjectId(playerChat.insertedId),
        observersChat: Types.ObjectId(observerChat.insertedId),
        stats: {
            winner: playerArray[0],
            startTime: new Date(),
            endTime: new Date(),
            totalShots: 0,
            shipsDestroyed: 0,
        },
    });

    return Promise.resolve(match.insertedId);
};

export async function createNMatch(n: number = 5): Promise<UserMatches> {
    let matchIds: string[];
    repeatUser = getUserData();
    matchIds = await createNMatchAux(n);
    userID = '';

    return Promise.resolve({
        userInfo: {
            userId: userBody.userId,
            username: repeatUser.username,
        },
        matchIds: matchIds,
    });
}

async function createNMatchAux(n: number, ids: string[] = []): Promise<string[]> {
    if (n > 0) {
        ids.push(await setupDbMatchApiTesting(repeatUser));
        return createNMatchAux(n - 1, ids);
    } else return Promise.resolve(ids);
}

export const teardownDbMatchApiTesting = async (): Promise<boolean> => {
    // TODO Dovrebbero essere tutti, perché repeat user in realtà ha lo userId di firstPlayer
    //  chiedere a Biagio
    await deleteMultipleUsers([firstPlayer.userId, secondPlayer.userId, userObserver.userId]);
    await deleteMultipleChats([playerChat.insertedId, observerChat.insertedId]);
    await deleteMatch(match.insertedId);

    return Promise.resolve(true);
};

export const deleteMatch = async (matchId: DocId): Promise<void> => {
    return deleteMultipleMatches([matchId]);
};

export const deleteMultipleMatches = async (matchIds: DocId[]): Promise<void> => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);

    await mongoDbApi.deleteMultipleMatches(matchIds);
};
