import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
    HttpParamsOptions,
} from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { throwError } from 'rxjs';

export interface RequestOptions {
    headers: HttpHeaders;
    params: HttpParams;
}

/**
 * Base class for Api wrappers
 */
export abstract class BaseApi {
    protected readonly baseUrl: string;
    protected readonly httpClient: HttpClient;

    protected constructor(httpClient: HttpClient, baseUrl: string = environment.serverBaseUrl) {
        this.baseUrl = baseUrl;
        this.httpClient = httpClient;
    }

    /**
     * Creates options for a non-authenticated HttpClient request
     * @param params
     * @protected
     */
    protected createRequestOptions(params?: HttpParamsOptions): RequestOptions {
        return {
            headers: new HttpHeaders({
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
            }),
            params: new HttpParams(params),
        };
    }

    protected handleError(error: HttpErrorResponse) {
        return throwError(() => error);
    }
}
