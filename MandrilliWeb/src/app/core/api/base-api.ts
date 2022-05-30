import axios from 'axios';
import { AxiosInstance } from "axios";

/**
 * Base class for Api wrappers
 */
export abstract class BaseApi {
    protected readonly _axios: AxiosInstance;

    protected constructor(baseUrl: string) {
        this._axios = axios.create({
            timeout: 20000,
            baseURL: baseUrl,
        });

        this._axios.defaults.headers.common['Content-Type'] = 'application/json';
    }
}

/**
 * Base class for Api wrappers that call authenticated endpoints
 */
export abstract class BaseAuthenticatedApi extends BaseApi {
    protected constructor(baseUrl: string, authToken: string) {
        super(baseUrl);

        this._axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }
}

