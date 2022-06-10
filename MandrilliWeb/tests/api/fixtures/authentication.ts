import { JwtStorage } from '../../../src/app/core/api/jwt-auth/jwt-storage';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { LoginInfo, AuthApi, AuthResult } from '../../../src/app/core/api/handlers/auth-api';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Jwt } from 'jsonwebtoken';

/**
 * Class that provides jwt storage and provider stubs.
 *
 * NOTE: All the stubs generated by the same instance of this stub provider
 * share the same place to store/retrieve the access token.
 */
export class JwtStubProvider {
    public accessToken: string;

    constructor() {
        this.accessToken = '';
    }

    public getJwtStorageStub(): JwtStorage {
        const setToken = (token: string) => {
            this.accessToken = token;
        };
        setToken.bind(this);

        return {
            store(token: string) {
                setToken(token);

                console.log('[JwtStorageStub] Token set!');
            },
        };
    }

    public getJwtProviderStub(): JwtProvider {
        const getToken = (): string => {
            return this.accessToken;
        };
        getToken.bind(this);

        return {
            getToken() {
                console.log('[JwtStorageStub] Token retrieved!');

                return getToken();
            },
        };
    }
}

export const authenticate = async (
    authApi: AuthApi,
    credentials: LoginInfo
): Promise<JwtProvider> => {
    // Await the authentication response
    const authObs: Observable<AuthResult> = await authApi.login(credentials);
    const authRes: AuthResult = await firstValueFrom(authObs);

    // Create the storage and provider for the jwt
    const stubProvider: JwtStubProvider = new JwtStubProvider();
    const jwtStorageStub: JwtStorage = stubProvider.getJwtStorageStub();
    const jwtProviderStub: JwtProvider = stubProvider.getJwtProviderStub();

    // Set the token so that the provider can retrieve it
    jwtStorageStub.store(authRes.jwt);

    // Return the provider, so it can be injected into the services
    // that require it
    return jwtProviderStub;
};