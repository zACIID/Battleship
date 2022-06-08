import { UserStats } from './../../../core/model/user/user-stats';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserApi } from '../../../core/api/handlers/user-api'
import { User } from '../../../core/model/user/user';

@Component({
    selector: 'app-profile-screen',
    templateUrl: './profile-screen.component.html',
    styleUrls: ['./profile-screen.component.css'],
})
export class ProfileScreenComponent implements OnInit {


    public myProfile: boolean = false;
    public user: User = new User();
    private userShowedId: string = "";
    public rank: string = "";
    public stats: UserStats = new UserStats();

    constructor(
        private userClient: UserApi,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {

        this.route.params.subscribe((params => {
            this.userShowedId = params['id'];
        }));
        this.getUser();
        this.getUserStats();

        let userInSessionId = localStorage.getItem('id') || "";

        if (userInSessionId === this.userShowedId){
            this.myProfile = true;
        }

    }

    public getUser() : void {
        try {
            this.userClient.getUser(this.userShowedId).subscribe((user: User) => {
                this.user = user;
                // TODO a chi serve modificare il campo online in questo modo ??  -agenty atmosferici
                this.user.online = true;
            });
        } catch(err) {
            console.log("An error occurred retrieving the user: " + err);
        }
    }


    public getUserStats() : void {
        try {

            if(!this.user) throw new Error("User is not defined");
            this.userClient.getStats(this.user.userId).subscribe((stat: UserStats) => {
                this.stats = stat;
            });
        } catch(err) {
            console.log("An error occurred while retrieving user stats: " + err);
        }
    }

    
}   
