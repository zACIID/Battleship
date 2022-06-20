import { Injectable } from '@angular/core';

import { MatchJoinHelper } from './match-join-helper';
import { Router } from '@angular/router';
import { JwtStorage } from '../../api/jwt-auth/jwt-storage';

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
        private router: Router
    ) {}

    public async logout(): Promise<void> {
        // Invalidate the previous token
        this.accessTokenStorage.store('');

        // Teardown all the match-join related listeners
        // Such listeners were set up right after the login
        this.matchJoinHelper.teardownEventHandlers();

        // Finally, redirect to the login screen
        await this.redirectToLoginScreen();
    }

    private async redirectToLoginScreen() {
        await this.router.navigate(['/authentication/login']);
    }
}
