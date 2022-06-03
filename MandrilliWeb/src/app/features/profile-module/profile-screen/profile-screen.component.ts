import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';
import { MatchApi, MatchInfo } from '../../../core/api/handlers/match-api'
import { UserApi } from '../../../core/api/handlers/user-api'
import { User } from '../../../core/model/user/user';
import { Match } from '../../../core/model/match/match';
import { UserStats } from '../../../core/model/user/user-stats';

@Component({
    selector: 'app-profile-screen',
    templateUrl: './profile-screen.component.html',
    styleUrls: ['./profile-screen.component.css'],
})
export class ProfileScreenComponent implements OnInit {

    public user: User
    public matchHistory: Match[] = []
    public stats: UserStats
    private userId: string
    public rank: string = ""
    constructor(private matchClient: MatchApi, private userClient: UserApi, private router: Router) {
        this.user = new User()
        this.stats = new UserStats()
        this.userId = localStorage.getItem('id') || ""
    }

    ngOnInit(): void {
        this.getUser()
        this.get10UserMatch()
        this.getUserStats()
    }

    public getUser() : void {
        try {
            this.userClient.getUser(this.userId).subscribe((user: User) => {
                this.user = user
                this.user.online = true
            })
        } catch(err) {
            console.log("Handling error: " + err)
        }
    }

    public get10UserMatch() : void {
        try {
            this.matchClient.getUserMatches(this.userId).subscribe((match: Match[]) => {
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
        this.rank = this.user.setrank(this.stats.elo)
    }
}
