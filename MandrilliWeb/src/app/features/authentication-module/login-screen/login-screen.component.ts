import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/model/user/user';
import { Router } from '@angular/router';
import { UserApi } from '../../../core/api/handlers/user-api';
import { AuthApi, LoginInfo, Jwt } from '../../../core/api/handlers/auth-api';
import { JwtStorage } from '../../../core/api/jwt-auth/jwt-storage';

@Component({
    selector: 'app-login-screen',
    templateUrl: './login-screen.component.html',
    styleUrls: ['./login-screen.component.css'],
})
export class LoginScreenComponent implements OnInit {
    constructor(
        private userClient: UserApi,
        private authClient: AuthApi,
        private accessTokenStorage: JwtStorage
    ) {}

    ngOnInit(): void {}

    login(username: string, password: string) {
        try {
            const loginInfo: LoginInfo = {
                username: username,
                password: password,
            };

            this.authClient.login(loginInfo).subscribe((data: Jwt) => {
                this.accessTokenStorage.store(data.token);
                //TODO, trovare un modo per salvare lo userId
                localStorage.setItem("username", username);
            });
        } catch (err) {
            console.log('An error occurred' + err);
        }
    }
}
