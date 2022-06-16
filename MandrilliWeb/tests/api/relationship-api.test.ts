import { RelationshipApi } from '../../src/app/core/api/handlers/relationship-api';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { HttpClient } from '@angular/common/http';
import { authenticate, getCredentialsForUser } from '../fixtures/authentication';
import { injectHttpClient } from '../fixtures/http-client';
import { deleteUser, InsertedUser, insertUser } from '../fixtures/database/users';
import { LoginInfo } from '../../src/app/core/api/handlers/auth-api';
import { Relationship } from '../../src/app/core/model/user/relationship';
import { deleteChat, insertChat, InsertedChat } from '../fixtures/database/chats';
import {
    getApiCredentials,
    MongoDbApi,
    MongoDpApiCredentials,
} from '../fixtures/database/mongodb-api/mongodb-api';
import { Types } from 'mongoose';

let httpClient: HttpClient;
let jwtProviderMainUser: JwtProvider;
let mainUser: InsertedUser;
let secondUser: InsertedUser;
let mongoDbApi: MongoDbApi;
let insertedChat: InsertedChat;

async function teardown(): Promise<void> {
    await deleteUser(mainUser.userId);
    await deleteUser(secondUser.userId);
    await deleteChat(insertedChat.chatId);

    await mongoDbApi.deleteRelationship(
        Types.ObjectId(secondUser.userId),
        Types.ObjectId(insertedChat.chatId)
    );
}

describe('Get Relationship', () => {
    beforeEach(async () => {
        httpClient = injectHttpClient();
        mainUser = await insertUser();
        secondUser = await insertUser();
        const apiCred: MongoDpApiCredentials = await getApiCredentials();
        mongoDbApi = new MongoDbApi(apiCred);
        insertedChat = await insertChat([mainUser.userId, secondUser.userId]);
        const modCred: LoginInfo = getCredentialsForUser(mainUser.userData.username);
        jwtProviderMainUser = await authenticate(modCred);
        await mongoDbApi.insertRelationship(
            Types.ObjectId(secondUser.userId),
            Types.ObjectId(insertedChat.chatId)
        );
    });

    afterEach(async () => {
        await teardown();
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const relationshipApi: RelationshipApi = new RelationshipApi(
            httpClient,
            jwtProviderMainUser
        );
        relationshipApi.getRelationships(mainUser.userId).subscribe({
            next: (relations: Relationship[]) => {
                // Expect non-empty response
                expect(relations).toBeTruthy();

                // Expect an object with the correct fields
                relations.forEach((relation) => {
                    expect(relation).toEqual(
                        expect.objectContaining<Relationship>({
                            friendId: expect.any(String),
                            chatId: expect.any(String),
                        })
                    );
                });
            },
            complete: () => {
                done();
            },
        });
    });

    //wrong ID (with no relationships)
    test('Should Throw', (done) => {
        const relationshipApi: RelationshipApi = new RelationshipApi(
            httpClient,
            jwtProviderMainUser
        );
        relationshipApi.getRelationships(secondUser.userId).subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();

                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });
});

describe('add Relationship', () => {
    beforeEach(async () => {
        httpClient = injectHttpClient();
        mainUser = await insertUser();
        secondUser = await insertUser();
        const apiCred: MongoDpApiCredentials = await getApiCredentials();
        mongoDbApi = new MongoDbApi(apiCred);
        insertedChat = await insertChat([mainUser.userId, secondUser.userId]);
        const modCred: LoginInfo = getCredentialsForUser(mainUser.userData.username);
        jwtProviderMainUser = await authenticate(modCred);
    });

    afterEach(async () => {
        await teardown();
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const relationshipApi: RelationshipApi = new RelationshipApi(
            httpClient,
            jwtProviderMainUser
        );
        relationshipApi
            .addRelationship(mainUser.userId, {
                friendId: secondUser.userId,
                chatId: insertedChat.chatId,
            })
            .subscribe({
                next: (relation: Relationship) => {
                    // Expect non-empty response
                    expect(relation).toBeTruthy();

                    // Expect an object with the correct fields
                    expect(relation).toEqual(
                        expect.objectContaining<Relationship>({
                            friendId: expect.any(String),
                            chatId: expect.any(String),
                        })
                    );
                },
                complete: () => {
                    done();
                },
            });
    });

    //wrong ID
    test('Should Throw', (done) => {
        const relationshipApi: RelationshipApi = new RelationshipApi(
            httpClient,
            jwtProviderMainUser
        );
        relationshipApi
            .addRelationship('ayo', { friendId: secondUser.userId, chatId: insertedChat.chatId })
            .subscribe({
                error: (err: Error) => {
                    expect(err).toBeTruthy();

                    done();
                },
                complete: () => {
                    throw Error('Observable should not complete without throwing');
                },
            });
    });
});

describe('delete Relationship', () => {
    beforeEach(async () => {
        httpClient = injectHttpClient();
        mainUser = await insertUser();
        secondUser = await insertUser();
        const apiCred: MongoDpApiCredentials = await getApiCredentials();
        mongoDbApi = new MongoDbApi(apiCred);
        insertedChat = await insertChat([mainUser.userId, secondUser.userId]);
        const modCred: LoginInfo = getCredentialsForUser(mainUser.userData.username);
        jwtProviderMainUser = await authenticate(modCred);
        await mongoDbApi.insertRelationship(
            Types.ObjectId(secondUser.userId),
            Types.ObjectId(insertedChat.chatId)
        );
    });

    afterEach(async () => {
        await deleteUser(mainUser.userId);
        await deleteUser(secondUser.userId);
        await deleteChat(insertedChat.chatId);
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const relationshipApi: RelationshipApi = new RelationshipApi(
            httpClient,
            jwtProviderMainUser
        );
        relationshipApi.removeRelationship(mainUser.userId, secondUser.userId).subscribe({
            complete: () => {
                done();
            },
        });
    });

    //wrong ID (with no relationships)
    test('Should Throw', (done) => {
        const relationshipApi: RelationshipApi = new RelationshipApi(
            httpClient,
            jwtProviderMainUser
        );
        relationshipApi.removeRelationship('ayo', secondUser.userId).subscribe({
            error: (err: Error) => {
                expect(err).toBeTruthy();

                done();
            },
            complete: () => {
                throw Error('Observable should not complete without throwing');
            },
        });
    });
});
