
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
    public user?: User = undefined;
    private userShowedId: string = '';
    public rank: string = '';

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
    
                
                this.isUserModerator = this.user.roles.includes(UserRoles.Moderator);
                
                let userInSessionId = this.userIdProvider.getUserId();
    
                if (userInSessionId === this.userShowedId) {
                    this.myProfile = true;
                }
            });

        });
        
    }

    
    
}
