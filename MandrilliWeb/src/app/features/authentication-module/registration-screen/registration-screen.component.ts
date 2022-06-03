import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserApi} from '../../../core/api/handlers/user-api'
import { User } from '../../../core/model/user/user'
import { AuthApi } from '../../../core/api/handlers/auth-api'
import { LoginInfo } from '../../../core/api/handlers/auth-api'

@Component({
    selector: 'app-registration-screen',
    templateUrl: './registration-screen.component.html',
    styleUrls: ['./registration-screen.component.css'],
})
export class RegistrationScreenComponent implements OnInit {

    public userInfo: LoginInfo = {}
    constructor(private authClient: AuthApi, private router: Router) {
        //gettare elem by id dall'html per userInfo
    }

    ngOnInit(): void {
        this.signup()
    }

    signup() {
        try {
            this.authClient.register( this.userInfo ).subscribe((data: User) => {
                localStorage.setItem('id', data.userId)
            })
        } catch(err){
            console.log("An error occurred" + err)
        }
    }
}
