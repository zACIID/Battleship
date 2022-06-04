import { RelationshipOverview } from './../../../core/model/user/relationship-overview';
import { MatchOverview } from './../../../core/model/match/match-overview';
import { Match } from './../../../core/model/match/match';
import { User } from './../../../core/model/user/user';
import { Notification } from './../../../core/model/user/notification';
import { Component, OnInit, Input } from '@angular/core';
import { NotificationOverview } from 'src/app/core/model/user/notification-overview';


@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {

    @Input() matchList?: MatchOverview[];
    @Input() friendList?: RelationshipOverview[];
    @Input() notificationList?: NotificationOverview[];

    constructor() {}

    ngOnInit(): void {}


    public num_matches() : number {
    
        if(this.matchList)
            return this.matchList.length;
        else return 0;

    }

    public num_friends() : number {

        if(this.friendList)
            return this.friendList.length;
        else return 0;

    }

}
