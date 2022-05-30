import { BaseApi } from './base-api';

export interface LoginInfo {
    /**
     * Username credential
     */
    username: string;

    /**
     * Password credential
     */
    password: string;
}

interface Jwt {
    /**
     * Value of the Json Web Token, used to authenticate future requests
     */
    token: string;
}

/**
 * Class that handles api endpoints for authentication
 */
export class AuthApi extends BaseApi {
    public constructor(baseUrl: string) {
        super(baseUrl);
    }

    public login(credentials: LoginInfo) {
        throw new Error("Not Implemented");
    }

    public register(credentials: LoginInfo) {
        throw new Error("Not Implemented");
    }
}
