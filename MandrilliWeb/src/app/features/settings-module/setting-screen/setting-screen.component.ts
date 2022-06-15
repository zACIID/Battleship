import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { JwtStorage } from './../../../core/api/jwt-auth/jwt-storage';
import { UserApi } from './../../../core/api/handlers/user-api';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-setting-screen',
    templateUrl: './setting-screen.component.html',
    styleUrls: ['./setting-screen.component.css'],
})
export class SettingScreenComponent implements OnInit {
    public userInSessionId: string = '';

    constructor(
        private userClient: UserApi,
        private router: Router,
        private accessTokenStorage: JwtStorage,
        private userIdProvider: UserIdProvider
    ) {}

    ngOnInit(): void {
        this.userInSessionId = this.userIdProvider.getUserId();
    }

    public changeUsername(newUsername: string) {
        try {
            this.userClient.updateUsername(this.userInSessionId, newUsername).subscribe((data) => {
                console.log('Correctly updated: ' + data.username);
            });
        } catch (err) {
            console.log('An error occurred while updating the username: ' + err);
        }
    }

    public changePwd(newPwd: string) {
        try {
            this.userClient.updatePassword(this.userInSessionId, newPwd).subscribe();
            console.log('Password correctly updated!');
        } catch (err) {
            console.log('An error occurred while updating the password: ' + err);
        }
    }

    public async logout() {
        this.accessTokenStorage.store("");
        await this.router.navigate(['/authentication/login']);
    }

    public async deleteProfile() {
        try {
            this.userClient.deleteUser(this.userInSessionId).subscribe();
            await this.logout();
            await this.router.navigate(['/authentication/register']);
        } catch (err) {
            console.log('An error occurred while deleting the user: ' + err);
        }
    }
}
