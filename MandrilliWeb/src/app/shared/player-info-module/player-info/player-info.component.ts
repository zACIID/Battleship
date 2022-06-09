import { getRank } from 'src/app/core/model/user/elo-rankings';
import { UserApi } from './../../../core/api/handlers/user-api';
import { UserOverview } from './../../../core/model/user/user-overview';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.css'],
})
export class PlayerInfoComponent implements OnInit {
    @Input() userId: string = '';
    public user: UserOverview = new UserOverview();

    constructor(private router: Router, private userClient: UserApi) {}

    ngOnInit(): void {
        try {
            this.userClient.getUser(this.userId).subscribe((us) => {
                this.user = {
                    userId: us.userId,
                    username: us.username,
                    elo: us.elo,
                    rank: getRank(us.elo),
                };
            });
        } catch (err) {
            console.log('An error occure while retrieving user info: ' + err);
        }
    }

    public show_profile() {
        let url: string = '/profile/' + this.userId;

        this.router.navigate([url]);
    }
}
