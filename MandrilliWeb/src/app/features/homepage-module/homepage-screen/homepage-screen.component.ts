import { UserIdProvider } from './../../../core/api/userId-auth/userId-provider';
import { UserOverview } from './../../../core/model/user/user-overview';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-homepage-screen',
    templateUrl: './homepage-screen.component.html',
    styleUrls: ['./homepage-screen.component.css'],
})
export class HomepageScreenComponent implements OnInit {
    
    public user: UserOverview = new UserOverview();
    public userInSessionId: string = '';

    constructor(
        private userIdProvider: UserIdProvider) {}

    ngOnInit(): void {
        this.userInSessionId = this.userIdProvider.getUserId();
    }
}
