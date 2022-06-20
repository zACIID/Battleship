import { getRank } from 'src/app/core/model/user/elo-rankings';
import { UserApi } from '../../../core/api/handlers/user-api';
import { Overview } from '../../../core/model/user/overview';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.css'],
})
export class PlayerInfoComponent implements OnInit {
    @Input() userId?: string;
    public user?: Overview = undefined;
    @Input() redirection: boolean = true;

    constructor(private router: Router, private userClient: UserApi) {}

    ngOnInit(): void {
        try {
            
            if(this.userId){
                this.userClient.getUser(this.userId).subscribe((us) => {
                    
                    this.user = {
                        userId: us.userId,
                        username: us.username,
                        elo: us.elo,
                        rank: getRank(us.elo),
                    };
                });
            }
        } catch (err) {
            console.log('An error occurs while retrieving user info: ' + err);
        }
    }

    public async show_profile() {
        if(this.redirection){
            let url: string = '/profile/' + this.userId;
            await this.router.navigate([url]);
        }
    }


}
