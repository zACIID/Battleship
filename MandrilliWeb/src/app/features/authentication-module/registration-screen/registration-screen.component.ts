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

    public signup(username: string, password: string) {
        this.userMessage.error = false;
        
        this.authClient.register({ username, password }).subscribe({
            next: (data: User) => {
                localStorage.setItem('id', data.userId);
                this.router.navigate(['/homepage']);
            },
            error: (error: any) =>{
                this.userMessage.error = true;
                this.userMessage.errorMessage = error.error.errorMessage;
                console.log('An error occurred while signin up: ' + JSON.stringify(error));
            },
        });
        
    }
}
