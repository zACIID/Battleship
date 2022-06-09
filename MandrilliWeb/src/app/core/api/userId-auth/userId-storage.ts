import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class UserIdStorage {
    constructor() {}

    /**
     * Stores the provided userId in the browser local storage.
     */
    public store(userId: string): void {
        localStorage.setItem(environment.localStorageUserId, userId);
    }
}