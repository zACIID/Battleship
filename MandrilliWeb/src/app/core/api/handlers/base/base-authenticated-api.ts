import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';

import { BaseApi, RequestOptions } from './base-api';
import { AccessTokenProvider } from '../../access-token-provider';

/**
 * Base class for Api wrappers that call authenticated endpoints
 */
export abstract class BaseAuthenticatedApi extends BaseApi {
    protected readonly accessTokenProvider: AccessTokenProvider;

    protected constructor(httpClient: HttpClient, accessTokenProvider: AccessTokenProvider) {
        super(httpClient);

        this.accessTokenProvider = accessTokenProvider;
    }

    /**
     * Creates options for an authenticated HttpClient request
     * @param params
     * @protected
     */
    protected override createRequestOptions(params?: HttpParamsOptions): RequestOptions {
        const reqOptions: RequestOptions = super.createRequestOptions(params);

        const accessToken: string = this.accessTokenProvider.getToken();
        const headersWithAuth: HttpHeaders = reqOptions.headers.set("Authorization", `Bearer ${accessToken}`);

        return {
            headers: headersWithAuth,
            params: reqOptions.params
        };
    }
}
