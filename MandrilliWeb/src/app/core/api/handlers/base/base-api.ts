import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
    HttpParamsOptions,
} from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { throwError } from 'rxjs';
import { Inject } from '@angular/core';

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

    protected constructor(httpClient: HttpClient, baseUrl: string = environment.apiBaseUrl) {
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
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                    'body was: ' +
                    JSON.stringify(error.error)
            );
        }

        return throwError(() => new Error('An error has occurred during or after an api request'));
    }
}
