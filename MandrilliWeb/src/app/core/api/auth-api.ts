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

export class AuthApi {
    constructor() {
    }
}
