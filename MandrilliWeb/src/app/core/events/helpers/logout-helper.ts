import { Injectable } from '@angular/core';

import { MatchJoinHelper } from './match-join-helper';
import { Router } from '@angular/router';
import { JwtStorage } from '../../api/jwt-auth/jwt-storage';
import { LogoutApi } from '../../api/handlers/logout-api';

/**
 * Class that helps to handle the logout procedure.
 */
@Injectable({
    providedIn: 'root',
})
export class LogoutHelper {
    constructor(
        private accessTokenStorage: JwtStorage,
        private matchJoinHelper: MatchJoinHelper,
        private logoutApi: LogoutApi,
        private router: Router
    ) {}

    public async logout(): Promise<void> {
        // Teardown all the match-join related listeners
        // Such listeners were set up right after the login
        this.matchJoinHelper.teardownEventHandlers();

        // Call the logout endpoint
        this.logoutApi.logout().subscribe({
            complete: async () => {
                // Invalidate the previous token in the storage
                this.accessTokenStorage.store('');

                // Finally, after logging out, redirect to the login screen
                await this.redirectToLoginScreen();
            },
        });
    }

    private async redirectToLoginScreen() {
        await this.router.navigate(['/authentication/login']);
    }
}
