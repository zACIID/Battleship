import { LoginInfo } from './../../../core/api/handlers/auth-api';
import { UserApi } from './../../../core/api/handlers/user-api';
import { ModeratorApi } from './../../../core/api/handlers/moderator-api';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'moderator-section',
    templateUrl: './moderator-section.component.html',
    styleUrls: ['./moderator-section.component.css'],
})
export class ModeratorSectionComponent implements OnInit {
    public userInSessionId: string = '';

    constructor(private moderatorClient: ModeratorApi, private userClient: UserApi) {}

    ngOnInit(): void {
        this.userInSessionId = localStorage.getItem('id') || '';
    }

    public ban(username: string): void {
        try {
            this.moderatorClient.banUser(this.userInSessionId, username);
        } catch (err) {
            console.log('An error occurred while banning a user: ' + err);
        }
    }

    public newModerator(usrnm: string, pwd: string): void {
        try {
            let loginInfo: LoginInfo = { username: usrnm, password: pwd };
            this.moderatorClient.addModerator(this.userInSessionId, loginInfo).subscribe((data) => {
                console.log('Correctly added: ' + data.username);
            });
        } catch (err) {
            console.log('An error occurred while creating a new moderator: ' + err);
        }
    }
}
