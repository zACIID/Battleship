import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserIdProvider {
    constructor() {}

    /**
     * Retrieves the id of the user currently logged.
     * Such id should be stored in the local storage.
     * If the user id is not set, an error is thrown.
     * @returns userId
     * @throws Error if the userId has not yet been set
     */
    public getUserId(): string {
        const userId: string | null = localStorage.getItem(environment.localStorageUserIdKey);

        if (!userId) throw new Error('UserId is not set yet');

        return userId;
    }
}
