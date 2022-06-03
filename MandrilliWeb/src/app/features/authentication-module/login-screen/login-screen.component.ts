import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/model/user/user';
import { Router } from '@angular/router';
import { UserApi } from '../../../core/api/handlers/user-api'
import { AuthApi, LoginInfo, Jwt } from '../../../core/api/handlers/auth-api'

@Component({
    selector: 'app-login-screen',
    templateUrl: './login-screen.component.html',
    styleUrls: ['./login-screen.component.css'],
})
export class LoginScreenComponent implements OnInit {

    constructor(private userClient: UserApi, private authClient: AuthApi) {

    }

    ngOnInit(): void {
        // TODO this.login() perché qui? login dovrebbe essere chiamato dal pulsante
    }

    login(username: string, password: string) {
        try {
            const loginInfo: LoginInfo = {
                username: username,
                password: password
            };

            this.authClient.login(loginInfo).subscribe( (data: Jwt) => {
                localStorage.setItem('token', data.token)
                // this.router.navigate(['/']);
            })
        } catch(err) {
            console.log("An error occurred" + err)
        }
    }
}
