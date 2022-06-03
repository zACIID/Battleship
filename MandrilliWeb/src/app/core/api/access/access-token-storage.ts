import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AccessTokenStorage {
    constructor() {}

    /**
     * Stores the provided token in the browser local storage.
     */
    public store(token: string): void {
        localStorage.setItem(environment.localStorageTokenKey, token);
    }
}
