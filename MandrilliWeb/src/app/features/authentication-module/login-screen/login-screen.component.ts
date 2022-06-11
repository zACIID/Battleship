import { HtmlErrorMessage } from './../../../core/model/utils/htmlErrorMessage';
import { Component, OnInit } from '@angular/core';
import { AuthApi, LoginInfo, AuthResult } from '../../../core/api/handlers/auth-api';
import { JwtStorage } from '../../../core/api/jwt-auth/jwt-storage';
import { UserIdStorage } from '../../../core/api/userId-auth/userId-storage';
import { Router } from '@angular/router';
import { ServerJoinedEmitter } from 'src/app/core/events/emitters/server-joined';

@Component({
    selector: 'app-login-screen',
    templateUrl: './login-screen.component.html',
    styleUrls: ['./login-screen.component.css'],
})
export class LoginScreenComponent implements OnInit {

    public userMessage: HtmlErrorMessage = new HtmlErrorMessage();

    constructor(
        private authClient: AuthApi,
        private accessTokenStorage: JwtStorage,
        private userIdStorage: UserIdStorage,
        private router: Router,
        private serverJoinedEmitter: ServerJoinedEmitter
    ) {}

    ngOnInit(): void {}

    login(username: string, password: string) {
        try {
            const loginInfo: LoginInfo = {
                username: username,
                password: password,
            };

            this.authClient.login(loginInfo).subscribe((data: AuthResult) => {
                this.accessTokenStorage.store(data.jwt);
                this.userIdStorage.store(data.userId);
                this.serverJoinedEmitter.emit({ userId: data.userId });
                // Add if -> if the username contains #temporary# then i should navigate to another page
                this.router.navigate(['/homepage']);
            });
        } catch (err: any) {
            this.userMessage.error = true;
            this.userMessage.errorMessage = err;
            console.log('An error occurred while logging in: ' + err);
        }
    }
}
