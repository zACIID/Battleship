import { HttpClient } from '@angular/common/http';

import { RelationshipApi } from '../../src/app/core/api/handlers/relationship-api';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { authenticate, getCredentialsForUser } from '../fixtures/authentication';
import { injectHttpClient } from '../fixtures/http-client';
import { deleteUser, InsertedUser, insertUser } from '../fixtures/database/users';
import { LoginInfo } from '../../src/app/core/api/handlers/auth-api';
import { Relationship } from '../../src/app/core/model/user/relationship';
import { addRelationship } from '../fixtures/api-utils/relationships';

let httpClient: HttpClient;
let jwtProviderMainUser: JwtProvider;
let mainUser: InsertedUser;
let secondUser: InsertedUser;

/**
 * @param insertRel True if we want to also add a relationship between the two users,
 *  false otherwise
 */
const testSetup = async (insertRel: boolean = true) => {
    httpClient = injectHttpClient();

    mainUser = await insertUser();
    secondUser = await insertUser();

    const userCred: LoginInfo = getCredentialsForUser(mainUser.userData.username);
    jwtProviderMainUser = await authenticate(userCred);

    if (insertRel) {
        await addRelationship(jwtProviderMainUser, mainUser.userId, secondUser.userId);
    }
};

const teardown = async (): Promise<void> => {
    await deleteUser(mainUser.userId);
    await deleteUser(secondUser.userId);
};

describe('Get Relationship', () => {
    beforeEach(async () => {
        await testSetup();
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
        // Do not add relationship here because it should be done by the api
        await testSetup(false);
    });

    afterEach(async () => {
        await teardown();
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const relationshipApi: RelationshipApi = new RelationshipApi(
            httpClient,
            jwtProviderMainUser
        );
        relationshipApi.addRelationship(mainUser.userId, secondUser.userId).subscribe({
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
        relationshipApi.addRelationship('wrong-user-id', secondUser.userId).subscribe({
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
        await testSetup();
    });

    afterEach(async () => {
        await teardown();
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
        relationshipApi.removeRelationship('wrong-user-id', secondUser.userId).subscribe({
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
