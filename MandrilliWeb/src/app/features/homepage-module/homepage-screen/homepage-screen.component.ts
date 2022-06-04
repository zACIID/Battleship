import { UserStats } from './../../../core/model/user/user-stats';
import { User } from './../../../core/model/user/user'
import { UserApi } from './../../../core/api/handlers/user-api';
import { UserOverview } from './../../../core/model/user/user-overview';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-homepage-screen',
    templateUrl: './homepage-screen.component.html',
    styleUrls: ['./homepage-screen.component.css'],
})
export class HomepageScreenComponent implements OnInit {

    public user?: UserOverview;


    constructor(private userClient: UserApi) {}

    ngOnInit(): void {
        let userId = localStorage.getItem('id') || "";

        try{
            this.userClient.getUser(userId).subscribe((x: User) =>{
                
                this.userClient.getStats(userId).subscribe((data: UserStats) => {

                    this.user = {
                        userId: x.userId,
                        username: x.username,
                        elo: data.elo
                    }
            
                })
            })
        }
        catch(err) {
            console.log("Handling error: " + err)
        }

    }
}
