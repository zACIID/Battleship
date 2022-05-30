import { BaseApi } from './base-api';
import { User } from '../model/user/user';

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
 * Class that handles communication with authentication-related endpoints
 */
export class AuthApi extends BaseApi {
    public constructor(baseUrl: string) {
        super(baseUrl);
    }

    // TODO login ritorna solo JWT, però a me serve anche userId per
    //  fare una getUser(userId). Considerare che Login debba ritornare anche uno userId
    public login(credentials: LoginInfo): Jwt {
        const reqPath: string = `/api/auth/signin`;

        throw new Error("Not Implemented");
    }

    public register(credentials: LoginInfo): User {
        const reqPath: string = `/api/auth/signup`;

        throw new Error("Not Implemented");
    }
}
