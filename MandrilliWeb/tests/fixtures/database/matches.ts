import { Types } from 'mongoose';
import {
    DocId,
    getApiCredentials,
    MongoDbApi,
    MongoDbSingleInsertResponse,
    MongoDpApiCredentials,
} from './mongodb-api/mongodb-api';
import { deleteMultipleUsers, InsertedUser, insertUser } from './users';
import { BattleshipGrid } from 'src/app/core/model/match/battleship-grid';
import { deleteMultipleChats, insertChat, InsertedChat } from './chats';
import { ShipTypes } from '../../../../src/model/match/state/ship';
import { Match } from '../../../../src/model/match/match';
import { SetupData } from '../utils';
import { getCredentialsForUser } from '../authentication';

export interface MatchesSetupData extends SetupData {
    insertedData: {
        authUser: InsertedUser;
        insMatches: InsertedMatch[];
    };
}

export interface InsertedMatch {
    matchId: string;
    playerIds: string[];
    observerIds: string[];
    chatIds: string[];
}

let apiCred: MongoDpApiCredentials;
let mongoDbApi: MongoDbApi;
const playerGrid: BattleshipGrid = {
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

export const getMatchData = (
    player1Id: string,
    player2Id: string,
    pChatId: string,
    obsChatId: string
): Match => {
    return {
        player1: {
            playerId: Types.ObjectId(player1Id),
            grid: {
                ships: [{ coordinates: playerGrid.ships[0].coordinates, type: ShipTypes.Cruiser }],
                shotsReceived: [],
            },
            isReady: false,
        },
        player2: {
            playerId: Types.ObjectId(player2Id),
            grid: { ships: [], shotsReceived: [] },
            isReady: false,
        },
        playersChat: Types.ObjectId(pChatId),
        observersChat: Types.ObjectId(obsChatId),
        stats: {
            winner: Types.ObjectId(player1Id),
            startTime: new Date(),
            endTime: new Date(),
            totalShots: 0,
            shipsDestroyed: 0,
        },
    };
};

/**
 * Inserts a match into the database. If match data is not provided,
 * some is generated. Such default data is composed of two players,
 * one observer and two chats.
 * @param matchData
 */
export const insertMatch = async (matchData?: Match): Promise<InsertedMatch> => {
    let playerIds: string[];
    let obsIds: string[];
    let chatIds: string[];

    // If not provided, generate some match data to insert
    if (!matchData) {
        const firstPlayer: InsertedUser = await insertUser();
        const secondPlayer: InsertedUser = await insertUser();
        const userObserver: InsertedUser = await insertUser();

        playerIds = [firstPlayer.userId, secondPlayer.userId];
        obsIds = [userObserver.userId];

        const playerChat: InsertedChat = await insertChat(playerIds);
        const observerChat: InsertedChat = await insertChat([userObserver.userId]);

        chatIds = [playerChat.chatId, observerChat.chatId];

        matchData = getMatchData(
            firstPlayer.userId,
            secondPlayer.userId,
            playerChat.chatId,
            observerChat.chatId
        );
    } else {
        const { player1, player2, observersChat, playersChat } = matchData;
        playerIds = [player1.playerId.toString(), player2.playerId.toString()];
        obsIds = []; // No observers retrievable from provided data
        chatIds = [playersChat.toString(), observersChat.toString()];
    }

    apiCred = await getApiCredentials();
    mongoDbApi = new MongoDbApi(apiCred, true);

    const matchId: MongoDbSingleInsertResponse = await mongoDbApi.insertMatch(matchData);

    return {
        matchId: matchId.insertedId.toString(),
        playerIds: playerIds,
        observerIds: obsIds,
        chatIds: chatIds,
    };
};

export const insertMultipleMatches = async (nMatches: number): Promise<MatchesSetupData> => {
    const matches: InsertedMatch[] = [];
    for (let i = 0; i < nMatches; i++) {
        matches.push(await insertMatch());
    }

    const userToAuthWith: InsertedUser = await insertUser();

    return {
        apiAuthCredentials: getCredentialsForUser(userToAuthWith.userData.username),
        insertedData: {
            authUser: userToAuthWith,
            insMatches: matches,
        },
    };
};

export const deleteMatch = async (matchId: DocId): Promise<void> => {
    return deleteMultipleMatches([matchId]);
};

export const deleteMultipleMatches = async (matchIds: DocId[]): Promise<void> => {
    const apiCred: MongoDpApiCredentials = await getApiCredentials();
    const mongoDbApi: MongoDbApi = new MongoDbApi(apiCred);

    await mongoDbApi.deleteMultipleMatches(matchIds);
};

/**
 * Deletes from the database all the data created during the
 * setup of multiple matches. This includes matches themselves
 * as well as all the chats and users that were created.
 * @param setupData
 */
export const teardownMatches = async (setupData: MatchesSetupData) => {
    // Gather all the ids of the matches, users, chats that have to be deleted
    const { authUser } = setupData.insertedData;
    let userIdsToDelete: string[] = [authUser.userId];
    let chatIdsToDelete: string[] = [];
    let matchIdsToDelete: string[] = [];
    setupData.insertedData.insMatches.forEach((insMatch: InsertedMatch) => {
        matchIdsToDelete.push(insMatch.matchId);

        userIdsToDelete = userIdsToDelete.concat(insMatch.playerIds);
        userIdsToDelete = userIdsToDelete.concat(insMatch.observerIds);

        chatIdsToDelete = chatIdsToDelete.concat(insMatch.chatIds);
    });

    await deleteMultipleMatches(matchIdsToDelete);
    await deleteMultipleUsers(userIdsToDelete);
    await deleteMultipleChats(chatIdsToDelete);
};
