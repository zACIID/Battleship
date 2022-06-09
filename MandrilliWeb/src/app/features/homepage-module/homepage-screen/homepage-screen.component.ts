import { getRank } from './../../../core/model/user/elo-rankings';
import { UserStats } from './../../../core/model/user/user-stats';
import { User } from './../../../core/model/user/user';
import { UserApi } from './../../../core/api/handlers/user-api';
import { UserOverview } from './../../../core/model/user/user-overview';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-homepage-screen',
    templateUrl: './homepage-screen.component.html',
    styleUrls: ['./homepage-screen.component.css'],
})
export class HomepageScreenComponent implements OnInit {
    public user: UserOverview = new UserOverview();
    public userId: string = '';

    constructor(private userClient: UserApi) {}

    ngOnInit(): void {
        this.userId = localStorage.getItem('id') || '';
    }
}
