import { UserApi } from './../../../core/api/handlers/user-api';
import { HtmlErrorMessage } from './../../../core/model/utils/htmlErrorMessage';
import { Component, OnInit } from '@angular/core';
import { AuthApi, LoginInfo, AuthResult } from '../../../core/api/handlers/auth-api';
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
        private router: Router,
        private userClient: UserApi,
        private serverJoinedEmitter: ServerJoinedEmitter
    ) {}

    ngOnInit(): void {}

    login(username: string, password: string) {
        try {
            const loginInfo: LoginInfo = {
                username: username,
                password: password,
            };

            this.authClient.login(loginInfo).subscribe(async (data: AuthResult) => {
                this.serverJoinedEmitter.emit({ userId: data.userId });

                /* TODO de-comment when status.temporary will be properly added
                this.userClient.getUser(data.userId).subscribe((user) => {

                    
                    if(user.status.temporary){
                        this.router.navigate(['/moderator-credentials']);
                    }
                    else{
                        this.router.navigate(['/homepage']);
                    }
                    
                })
                */
                this.router.navigate(['/homepage']);
                
            });
        } catch (err: any) {
            this.userMessage.error = true;
            this.userMessage.errorMessage = err;
            console.log('An error occurred while logging in: ' + err);
        }
    }
}
