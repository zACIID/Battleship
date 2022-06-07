import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatchApi } from '../../../core/api/handlers/match-api'
import { UserApi } from '../../../core/api/handlers/user-api'
import { User } from '../../../core/model/user/user';
import { UserStats } from '../../../core/model/user/user-stats';
import { getRank } from '../../../core/model/user/elo-rankings';

@Component({
    selector: 'app-profile-screen',
    templateUrl: './profile-screen.component.html',
    styleUrls: ['./profile-screen.component.css'],
})
export class ProfileScreenComponent implements OnInit {

    public user: User;
    private userId: string;
    public rank: string = "";


    constructor(private matchClient: MatchApi, private userClient: UserApi, private router: Router) {
        this.user = new User();
        this.userId = localStorage.getItem('id') || "";
    }

    ngOnInit(): void {
        this.getUser();
    }

    public getUser() : void {
        try {
            this.userClient.getUser(this.userId).subscribe((user: User) => {
                this.user = user;
                this.user.online = true;
            });
        } catch(err) {
            console.log("Handling error: " + err);
        }
    }

    /*
        private applyRank(){
            this.rank = getRank(this.stats.elo);
        }
    */
}   
