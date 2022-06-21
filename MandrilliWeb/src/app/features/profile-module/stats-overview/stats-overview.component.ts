import { Relationship } from './../../../core/model/user/relationship';
import { RelationshipApi } from './../../../core/api/handlers/relationship-api';

import { StatsOverview } from './../../../core/model/user/stats-overview';
import { UserApi } from './../../../core/api/handlers/user-api';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { NotificationType } from './../../../core/model/user/notification';
import { NotificationApi } from './../../../core/api/handlers/notification-api';
import { UserStats } from '../../../core/model/user/stats';
import { User } from './../../../core/model/user/user';
import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'stats-overview',
    templateUrl: './stats-overview.component.html',
    styleUrls: ['./stats-overview.component.css'],
})
export class StatsOverviewComponent implements OnInit {
    
    
    @Input() user?: User = undefined;
    public stats?: StatsOverview[] = undefined;
    @Input() myProfile: boolean = false;
    public alreadyFriend: boolean = false;
    @ViewChild("addButton") addButton?: ElementRef;

    constructor(
        private notificationClient: NotificationApi,
        private userIdProvider: UserIdProvider,
        private userClient: UserApi,
        private relationshipClient: RelationshipApi
    ) {
      
    }

    ngOnInit(): void {

        if (this.user){

            this.userClient.getStats(this.user.userId).subscribe((stat: UserStats) => {
                this.stats = [];
                this.stats.push({title: "Top Elo", value: stat.topElo});
                this.stats.push({title: "Total Wins", value: stat.wins});
                this.stats.push({title: "Total Losses", value: stat.losses});
                this.stats.push({title: "Ships Destroyed", value: stat.shipsDestroyed});
                this.stats.push({title: "Total Shots", value: stat.totalShots});
                this.stats.push({title: "Total Hits", value: stat.totalHits});
                
            });

            const userInSessionId = this.userIdProvider.getUserId()
            this.relationshipClient.getRelationships(userInSessionId).subscribe((rels: Relationship[]) => {
                rels = rels.filter((r) => r.friendId === this.user?.userId)
                if (rels.length > 0 ) this.alreadyFriend = true;
            })

        }
        else{
            throw new Error('User is not defined');
        }

    }

    public addFriend() {
        let userInSessionId = this.userIdProvider.getUserId();
        if(this.addButton){
            this.addButton.nativeElement.disabled = true;
            this.addButton.nativeElement.innerText = "Pending...";
        }
        if(this.user){
            this.notificationClient
                .addNotification(this.user.userId, {
                    type: NotificationType.FriendRequest,
                    sender: userInSessionId,
                })
                .subscribe((data) => {
                    console.log('Correctly added notification: ' + JSON.stringify(data));
                });
        }else{
            console.log('An error occurred in the process of adding a friend');
        }
    }

}
