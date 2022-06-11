import { HttpClient } from '@angular/common/http';

import { AuthApi, AuthResult, LoginInfo } from '../../src/app/core/api/handlers/auth-api';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import {
    apiAuthPassword,
    authenticate,
    JwtStubProvider,
    UserIdStubProvider,
} from './fixtures/authentication';
import { injectHttpClient } from './fixtures/http-client';
import { JwtStorage } from '../../src/app/core/api/jwt-auth/jwt-storage';
import { UserIdStorage } from '../../src/app/core/api/userId-auth/userId-storage';
import { SetupData } from './fixtures/utils';
import { deleteUser, InsertedUser, insertUser } from './fixtures/database/users';

interface AuthTestingSetupData extends SetupData {
    insertedData: {
        user: InsertedUser;
    };
}

const setupAuthApiTesting = async (): Promise<AuthTestingSetupData> => {
    const insertedUser: InsertedUser = await insertUser();

    return {
        apiAuthCredentials: {
            username: insertedUser.userData.username,
            password: apiAuthPassword,
        },
        insertedData: {
            user: insertedUser,
        },
    };
};

const teardownAuthApiTesting = async (setupData: AuthTestingSetupData): Promise<void> => {
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
const wrongChatId: string = 'wrong-chat-id';

beforeEach(async () => {
    httpClient = injectHttpClient();
    setupData = await setupAuthApiTesting();

    jwtProvider = await authenticate(setupData.apiAuthCredentials);
});

afterEach(async () => {
    await teardownAuthApiTesting(setupData);
});

describe('Login', () => {
    test('Login Should Return Non-Empty Response With Correct Fields', (done) => {
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

    test('login Should Throw', (done) => {
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

// TODO tests for signup
