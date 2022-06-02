import { Component, OnInit } from '@angular/core';
import { User, CUser } from '../../../core/model/user/user';
import { Router } from '@angular/router';
import { UserApi } from '../../../core/api/user-api'
import { AuthApi, LoginInfo } from '../../../core/api/auth-api'

@Component({
    selector: 'app-login-screen',
    templateUrl: './login-screen.component.html',
    styleUrls: ['./login-screen.component.css'],
})
export class LoginScreenComponent implements OnInit {

    public logInfo: LoginInfo = {}
    constructor(private userClient: UserApi, private authClient: AuthApi, private router: Router) {
        //gettare elem by id dall'html per userInfo
    }

    ngOnInit(): void {
        this.login()
    }

    login() {
        try {
            this.authClient.login(this.logInfo).subscribe( (data) => {
                localStorage.setItem('token', data.token.token)
                // this.router.navigate(['/']);
            })
        } catch(err) {
            console.log("An error occurred" + err)
        }
    }
}
