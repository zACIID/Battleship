import { UserOverview } from './../../../core/model/user/user-overview';
import { RelationshipOverview } from './../../../core/model/user/relationship-overview';
import { MatchOverview } from './../../../core/model/match/match-overview';
import { Component, OnInit, Input } from '@angular/core';
import { NotificationOverview } from 'src/app/core/model/user/notification-overview';


@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {

    @Input() matchList?: MatchOverview[];
    @Input() friendsList?: RelationshipOverview[];
    @Input() userList?: UserOverview[];
    @Input() notificationList?: NotificationOverview[];
    
    /** Action that will be triggered by clicking the entire list element */
    @Input() clickAction?: Function

    /** Particular props for accepting or refusing an incoming notification */
    @Input() accept?: Function
    @Input() refuse?: Function

    constructor() {}

    ngOnInit(): void {}


    public num_matches() : number {
    
        if(this.matchList)
            return this.matchList.length;
        else return 0;

    }

    public num_users() : number {

        if(this.userList)
            return this.userList.length;
        else return 0;
    }


    public num_friends() : number {

        if(this.friendsList)
            return this.friendsList.length;
        else return 0;

    }

}
