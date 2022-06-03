import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/model/user/user';
import { Router } from '@angular/router';
import { UserApi } from '../../../core/api/handlers/user-api';
import { AuthApi, LoginInfo, Jwt } from '../../../core/api/handlers/auth-api';
import { AccessTokenStorage } from '../../../core/api/access/access-token-storage';

@Component({
    selector: 'app-login-screen',
    templateUrl: './login-screen.component.html',
    styleUrls: ['./login-screen.component.css'],
})
export class LoginScreenComponent implements OnInit {
    constructor(
        private _userClient: UserApi,
        private _authClient: AuthApi,
        private _accessTokenStorage: AccessTokenStorage
    ) {}

    ngOnInit(): void {}

    login(username: string, password: string) {
        try {
            const loginInfo: LoginInfo = {
                username: username,
                password: password,
            };

            this._authClient.login(loginInfo).subscribe((data: Jwt) => {
                this._accessTokenStorage.store(data.token);
            });
        } catch (err) {
            console.log('An error occurred' + err);
        }
    }
}
