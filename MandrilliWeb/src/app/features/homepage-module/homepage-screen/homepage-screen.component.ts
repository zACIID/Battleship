import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserIdProvider } from '../../../core/api/userId-auth/userId-provider';
import { Overview } from '../../../core/model/user/overview';

@Component({
    selector: 'app-homepage-screen',
    templateUrl: './homepage-screen.component.html',
    styleUrls: ['./homepage-screen.component.css'],
})
export class HomepageScreenComponent implements OnInit {
    public user: Overview = new Overview();
    public userInSessionId: string = '';

    constructor(private router: Router, private userIdProvider: UserIdProvider) {}

    ngOnInit(): void {
        this.userInSessionId = this.userIdProvider.getUserId();
    }
}
