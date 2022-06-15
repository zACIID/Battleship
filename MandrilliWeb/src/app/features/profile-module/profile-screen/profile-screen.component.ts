
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { UserStats } from '../../../core/model/user/stats';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserApi } from '../../../core/api/handlers/user-api';
import { User, UserRoles } from '../../../core/model/user/user';

@Component({
    selector: 'app-profile-screen',
    templateUrl: './profile-screen.component.html',
    styleUrls: ['./profile-screen.component.css'],
})
export class ProfileScreenComponent implements OnInit {
    public myProfile: boolean = false;
    public isUserModerator: boolean = false;
    public user: User = new User();
    private userShowedId: string = '';
    public rank: string = '';
    public stats: UserStats = new UserStats();

    constructor(
        private userClient: UserApi,
        private route: ActivatedRoute,
        private userIdProvider: UserIdProvider
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.userShowedId = params['id'];

            this.userClient.getUser(this.userShowedId).subscribe((user: User) => {
                this.user = user;
    
                this.getUserStats();
                this.isUserModerator = this.user.roles.includes(UserRoles.Moderator);
                
                let userInSessionId = this.userIdProvider.getUserId();
    
                if (userInSessionId === this.userShowedId) {
                    this.myProfile = true;
                }
            });

        });
        
    }

    
    public getUserStats(): void {
        try {
            if (!this.user) throw new Error('User is not defined');
            this.userClient.getStats(this.user.userId).subscribe((stat: UserStats) => {
                this.stats = stat;
            });
        } catch (err) {
            console.log('An error occurred while retrieving user stats: ' + err);
        }
    }
}
