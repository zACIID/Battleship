import { UserApi } from './../../../core/api/handlers/user-api';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-setting-screen',
    templateUrl: './setting-screen.component.html',
    styleUrls: ['./setting-screen.component.css'],
})
export class SettingScreenComponent implements OnInit {

    public userInSessionId: string = "";

    constructor(
        private userClient: UserApi,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.userInSessionId = localStorage.getItem('id') || "";
    }


    public changeUsername(newUsername: string){
        try{
            this.userClient.updateUsername(this.userInSessionId, newUsername).subscribe((data) => {
                console.log("Correctly updated: " + data.username);
            })
        }
        catch(err){
            console.log("An error occurred while updating the username: " + err);
        }
    }

    public changePwd(newPwd: string){
        try{
            this.userClient.updatePassword(this.userInSessionId, newPwd);
            console.log("Password correctly updated!");
        }
        catch(err){
            console.log("An error occurred while updating the password: " + err);
        }
    }

    public logout(){
        // TODO we should drop here the JWT token
    }

    public deleteProfile(){

        try{
            this.userClient.deleteUser(this.userInSessionId);
            this.logout();
            this.router.navigate(["/authentication/register"]);
        }
        catch(err){
            console.log("An error occurred while deleting the user: " + err);
        }
    }


}
