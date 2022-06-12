import { HtmlErrorMessage } from './../../../core/model/utils/htmlErrorMessage';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../core/model/user/user';
import { AuthApi } from '../../../core/api/handlers/auth-api';

@Component({
    selector: 'app-registration-screen',
    templateUrl: './registration-screen.component.html',
    styleUrls: ['./registration-screen.component.css'],
})
export class RegistrationScreenComponent implements OnInit {

    public userMessage: HtmlErrorMessage = new HtmlErrorMessage();


    constructor(
        private authClient: AuthApi,
        private router: Router
    ) {}

    ngOnInit(): void {}

    signup(username: string, password: string) {
        try {
            this.authClient.register({ username, password }).subscribe((data: User) => {
                localStorage.setItem('id', data.userId);
                this.router.navigate(['/homepage']);
            });
        } catch (err: any) {
            this.userMessage.error = true;
            this.userMessage.errorMessage = err;
            console.log('An error occurred while signin up: ' + err);
        }
    }
}
