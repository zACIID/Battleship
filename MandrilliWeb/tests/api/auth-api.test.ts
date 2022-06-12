import { HttpClient } from '@angular/common/http';

import { injectHttpClient } from '../fixtures/http-client';
import { AuthApi, AuthResult, LoginInfo } from '../../src/app/core/api/handlers/auth-api';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { JwtStorage } from '../../src/app/core/api/jwt-auth/jwt-storage';
import { UserIdStorage } from '../../src/app/core/api/userId-auth/userId-storage';
import {
    authenticate,
    getCredentialsForUser,
    JwtStubProvider,
    UserIdStubProvider,
} from '../fixtures/authentication';
import { deleteUser, InsertedUser, insertUser } from '../fixtures/database/users';
import { SetupData } from '../fixtures/utils';
import { User } from '../../src/app/core/model/user/user';

interface AuthTestingSetupData extends SetupData {
    insertedData: {
        user: InsertedUser;
    };
}

/**
 * Insert a user in the db, which will be used to authenticate with the api
 */
const setupDb = async (): Promise<AuthTestingSetupData> => {
    const insertedUser: InsertedUser = await insertUser();

    return {
        apiAuthCredentials: getCredentialsForUser(insertedUser.userData.username),
        insertedData: {
            user: insertedUser,
        },
    };
};

/**
 * Deletes the user inserted in the setup
 * @param setupData
 */
const teardownDb = async (setupData: AuthTestingSetupData): Promise<void> => {
    await deleteUser(setupData.insertedData.user.userId);
};

const getAuthApi = (): AuthApi => {
    const jwtStubProvider: JwtStubProvider = new JwtStubProvider();
    const jwtStorage: JwtStorage = jwtStubProvider.getJwtStorageStub();

    const userIdStubProvider: UserIdStubProvider = new UserIdStubProvider();
    const userIdStorage: UserIdStorage = userIdStubProvider.getUserIdStorageStub();

    return new AuthApi(httpClient, jwtStorage, userIdStorage);
};

let httpClient: HttpClient;
let setupData: AuthTestingSetupData;
let jwtProvider: JwtProvider;

const testSetup = async () => {
    httpClient = injectHttpClient();
    setupData = await setupDb();

    jwtProvider = await authenticate(setupData.apiAuthCredentials);
};

const testTeardown = async () => {
    await teardownDb(setupData);
};

describe('Login', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const authApi: AuthApi = getAuthApi();
        const credentials: LoginInfo = setupData.apiAuthCredentials;

        authApi.login(credentials).subscribe({
            next: (authRes: AuthResult) => {
                // Expect non-empty response
                expect(authRes).toBeTruthy();

                // Expect an object with the correct fields
                expect(authRes).toEqual(
                    expect.objectContaining<AuthResult>({
                        userId: expect.any(String),
                        token: expect.any(String),
                    })
                );
            },
            complete: () => {
                done();
            },
        });
    });

    test('Should Throw', (done) => {
        const authApi: AuthApi = getAuthApi();
        const wrongCredentials: LoginInfo = {
            username: 'wrong-username',
            password: 'wrong-password',
        };

        authApi.login(wrongCredentials).subscribe({
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

describe('Signup', () => {
    beforeEach(async () => {
        await testSetup();
    });

    afterEach(async () => {
        await testTeardown();
    });

    test('Should Return Non-Empty Response With Correct Fields', (done) => {
        const authApi: AuthApi = getAuthApi();
        const newCredentials: LoginInfo = {
            username: 'any-username',
            password: 'any-password',
        };
        let newUser: User;

        authApi.register(newCredentials).subscribe({
            next: (user: User) => {
                // Save for teardown
                newUser = user;

                // Expect non-empty response
                expect(user).toBeTruthy();

                // Expect an object with the correct fields
                expect(user).toEqual(
                    expect.objectContaining<User>({
                        userId: expect.any(String),
                        username: expect.any(String),
                        roles: expect.any(Array),
                        status: expect.any(String),
                        elo: expect.any(Number),
                    })
                );
            },
            complete: async () => {
                // Teardown the registered user
                await deleteUser(newUser.userId);

                done();
            },
        });
    });

    test('Should Throw', (done) => {
        const authApi: AuthApi = getAuthApi();

        const insertedUser: InsertedUser = setupData.insertedData.user;
        const duplicateCredentials: LoginInfo = {
            username: insertedUser.userData.username,
            password: 'any-password',
        };

        authApi.login(duplicateCredentials).subscribe({
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
