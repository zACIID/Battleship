import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';
import { MatchApi, MatchInfo } from '../../../core/api/match-api'
import { UserApi } from '../../../core/api/user-api'
import { User, CUser } from '../../../core/model/user/user';
import { Match } from '../../../core/model/match/match';
import { CUserStats, UserStats } from '../../../core/model/user/user-stats';

@Component({
    selector: 'app-profile-screen',
    templateUrl: './profile-screen.component.html',
    styleUrls: ['./profile-screen.component.css'],
})
export class ProfileScreenComponent implements OnInit {

    public user: CUser
    public matchHistory: Match[] = []
    public stats: CUserStats
    private userId: string
    constructor(private matchClient: MatchApi, private userClient: UserApi, private router: Router) {
        this.user = new CUser()
        this.stats = new CUserStats()
        this.userId = localStorage.getItem('id') || ""
    }

    ngOnInit(): void {}

    public getUser() : void {
        try {
            this.userClient.getUser(this.userId).subscribe((user: User) => {
                this.user = user
            })
        } catch(err) {
            console.log("Handling error: " + err)
        }
    }

    public get10UserMatch() : void {
        try {
            this.matchClient.getuserMatches(this.userId).subscribe((match: Match[]) => {
                this.matchHistory = [...match]
            })
        } catch(err) {
            console.log("Handling error: " + err)
        }
    }

    public getUserStats() : void {
        try {
            this.userClient.getStats(this.userId).subscribe((stat: UserStats) => {
                this.stats = stat
                this.applyRank()
            })
        } catch(err) {
            console.log("Handling error: " + err)
        }
    }

    private applyRank(){

    }

    // ignietto contruct gli api, match, user
    // match history 
    // info personali, (stats, and shi)
    // rank da fare (formula)
    // 
}
