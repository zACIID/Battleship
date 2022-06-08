import { Component, OnInit } from '@angular/core';
import { AuthApi, LoginInfo, Jwt } from '../../../core/api/handlers/auth-api';
import { JwtStorage } from '../../../core/api/jwt-auth/jwt-storage';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-screen',
    templateUrl: './login-screen.component.html',
    styleUrls: ['./login-screen.component.css'],
})
export class LoginScreenComponent implements OnInit {
    constructor(
        private authClient: AuthApi,
        private accessTokenStorage: JwtStorage,
        private router: Router
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
                // TODO, trovare un modo per salvare lo userId
                // localStorage.setItem('id', data.userId);
                this.router.navigate(["/homepage"]);
            });
        } catch (err) {
            console.log('An error occurred while logging in: ' + err);
        }
    }
}
