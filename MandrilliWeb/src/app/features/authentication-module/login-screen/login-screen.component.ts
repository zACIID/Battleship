import { UserApi } from '../../../core/api/handlers/user-api';
import { HtmlErrorMessage } from '../../../core/model/utils/htmlErrorMessage';
import { Component, OnInit } from '@angular/core';
import { AuthApi, LoginInfo, AuthResult } from '../../../core/api/handlers/auth-api';
import { Router } from '@angular/router';
import { ServerJoinedEmitter } from 'src/app/core/events/emitters/server-joined';
import { UserStatus } from 'src/app/core/model/user/user';
import { MatchJoinHelper } from '../../../core/events/helpers/match-join-helper';

@Component({
    selector: 'app-login-screen',
    templateUrl: './login-screen.component.html',
    styleUrls: ['./login-screen.component.css'],
})
export class LoginScreenComponent implements OnInit {
    public userMessage: HtmlErrorMessage = new HtmlErrorMessage();

    constructor(
        private authClient: AuthApi,
        private router: Router,
        private userClient: UserApi,
        private serverJoinedEmitter: ServerJoinedEmitter,
        private matchJoinHelper: MatchJoinHelper
    ) {}

    ngOnInit(): void {}

    public async login(username: string, password: string) {
        const loginInfo: LoginInfo = {
            username: username,
            password: password,
        };

        this.authClient.login(loginInfo).subscribe({
            next: (data: AuthResult) => {
                this.serverJoinedEmitter.emit({ userId: data.userId });

                this.userClient.getUser(data.userId).subscribe(async (user) => {
                    // Setup all the match-join related handlers right after login,
                    // since such events can be raised at any time.
                    // Teardown should be done on logout
                    this.matchJoinHelper.setupEventHandlers();

                    if (user.status === UserStatus.TemporaryCredentials) {
                        await this.router.navigate(['/moderator-credentials']);
                    } else {
                        await this.router.navigate(['/homepage']);
                    }
                });
            },
            error: (err: any) => {
                this.userMessage.error = true;
                if (err.error === 'Unauthorized') {
                    this.userMessage.errorMessage = 'Wrong credentials';
                } else this.userMessage.errorMessage = JSON.stringify(err.error);
                console.log('An error occurred while logging in: ' + JSON.stringify(err));
            },
        });
    }
}
