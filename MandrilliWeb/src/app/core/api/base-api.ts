/**
 * Base class for Api wrappers
 */
export abstract class BaseApi {
    public readonly host: string;

    protected constructor(host: string) {
        this.host = host;
    }
}

/**
 * Base class for Api wrappers that call authenticated endpoints
 */
export abstract class BaseAuthenticatedApi extends BaseApi {
    public readonly authToken: string;

    protected constructor(host: string, authToken: string) {
        super(host);

        this.authToken = authToken;
    }
}

