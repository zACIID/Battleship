import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';


@Injectable({
    providedIn: "root"
})
export class AccessTokenProvider {
    constructor() {
    }

    /**
     * Retrieves the token used to authenticate requests to the backend.
     * Such token should be stored in the local storage.
     * If the token is not set, an error is thrown.
     * @returns access token
     * @throws Error if the token has not yet been set
     */
    public getToken(): string {
        const token: string | null = localStorage.getItem(environment.localStorageTokenKey);

        if (token === null) {
            throw new Error("Access Token is not set");
        }

        return token;
    }
}
