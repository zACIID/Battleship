import { Types } from 'mongoose';
import {
    getApiCredentials,
    MongoDbApi,
    MongoDbSingleInsertResponse,
    MongoDpApiCredentials,
} from './mongodb-api';
import { Chat } from '../../../../../src/model/chat/chat';
import { apiAuthPassword } from '../authentication';
import { deleteUser, getUserData, InsertedUser, insertUser } from './users';
import { SetupData } from '../utils';
import { ChatApiTestingSetupData, setupDbChatApiTesting } from './chats';
import { timestamp } from 'rxjs';
import { createMatch, Match } from '../../../../../src/model/match/match';
import { User } from '../../../../../src/model/user/user';

let apiCred: MongoDpApiCredentials
let mongoDbApi: MongoDbApi
let firstPlayer: InsertedUser
let secondPlayer: InsertedUser
let userObserver: InsertedUser
let playerArray: Types.ObjectId[] 
let playerChatId: MongoDbSingleInsertResponse 
let observerChat: MongoDbSingleInsertResponse 
let match: MongoDbSingleInsertResponse
let repeatUser: User = getUserData()
let reapeatUserMatch: {username: string, matchId: string}


export const setupDbMatchApiTesting = async (userData?: User): Promise<any> => {
    let userBody: InsertedUser = new InsertedUser()
    apiCred = await getApiCredentials();
    mongoDbApi = new MongoDbApi(apiCred);
    if (userData) {
        const insertUserRes: MongoDbSingleInsertResponse = await mongoDbApi.insertUser(userData)
        const userId: string = insertUserRes.insertedId
        userBody = {
            userId: userId,
            userData: userData,
        };
    }
    firstPlayer = (userData)? await insertUser() : userBody
    secondPlayer = await insertUser();
    userObserver = await insertUser();
    playerArray = [Types.ObjectId(firstPlayer.userId), Types.ObjectId(secondPlayer.userId)]
    playerChatId = await mongoDbApi.insertChat({users:playerArray, messages:[]})
    observerChat = await mongoDbApi.insertChat({users:[Types.ObjectId(userObserver.userId)], messages:[]})
    match = await 
    mongoDbApi.insertMatch({
        player1: {
            playerId: playerArray[0], 
            grid: {ships: [], shotsReceived: []},
            isReady: true
        },
        player2: {
            playerId: playerArray[0], 
            grid: {ships: [], shotsReceived: []},
            isReady: true
        },
        playersChat: Types.ObjectId(playerChatId.insertedId),
        observersChat: Types.ObjectId(observerChat.insertedId),
        stats: {
            winner: playerArray[0],
            startTime: new Date(),
            endTime: new Date(),
            totalShots: 0,
            shipsDestroyed: 0
        }
    })
    return Promise.resolve(match.insertedId)
};

export async function createNMatch(n: number = 5) : Promise<string> {
    await createNMatch(n)
    return Promise.resolve(repeatUser.username)
}


async function createNMatchAux(n: number) : Promise<void> {
    if (n > 0) await Promise.all([createNMatchAux(n - 1), setupDbMatchApiTesting(repeatUser)])
}




export const teardownDbChatApiTesting = async (): Promise<boolean> => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);
    mongoDbApi.emptyUserCollection()
    mongoDbApi.emptyChatCollection()
    mongoDbApi.emptyMatchCollection()
    return Promise.resolve(true)
}
