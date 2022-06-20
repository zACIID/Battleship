import { ServerJoinedEmitter } from 'src/app/core/events/emitters/server-joined';
import { AuthResult } from './../../../core/api/handlers/auth-api';
import { UserIdStorage } from './../../../core/api/userId-auth/userId-storage';
import { HtmlErrorMessage } from './../../../core/model/utils/htmlErrorMessage';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../core/model/user/user';
import { AuthApi } from '../../../core/api/handlers/auth-api';
import { MatchJoinHelper } from '../../../core/events/helpers/match-join-helper';

@Component({
    selector: 'app-registration-screen',
    templateUrl: './registration-screen.component.html',
    styleUrls: ['./registration-screen.component.css'],
})
export class RegistrationScreenComponent implements OnInit {
    public userMessage: HtmlErrorMessage = new HtmlErrorMessage();

    constructor(
        private authClient: AuthApi,
        private router: Router,
        private serverJoined: ServerJoinedEmitter,
        private matchJoinHelper: MatchJoinHelper
    ) {}

    ngOnInit(): void {}

    public signup(username: string, password: string) {
        this.userMessage.error = false;

        this.authClient.register({ username, password }).subscribe({
            next: async (data: User) => {
                this.authClient
                    .login({ username: data.username, password: password })
                    .subscribe(async (user: AuthResult) => {
                        this.serverJoined.emit({ userId: user.userId });

                        // Setup all the match-join related handlers right after login,
                        // since such events can be raised at any time.
                        // Teardown should be done on logout
                        this.matchJoinHelper.setupEventHandlers();

                        await this.router.navigate(['/homepage']);
                    });
            },
            error: (error: any) => {
                this.userMessage.error = true;
                this.userMessage.errorMessage = error.error.errorMessage;
                console.log('An error occurred while signin up: ' + JSON.stringify(error));
            },
        });
    }
}
