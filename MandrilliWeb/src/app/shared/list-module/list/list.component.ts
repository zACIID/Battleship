import { Router } from '@angular/router';
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
    @Input() notificationList?: NotificationOverview[];
    

    /** Particular props for accepting or refusing an incoming notification */
    @Input() accept?: Function
    @Input() refuse?: Function

    constructor(
        private router: Router
    ) {}

    ngOnInit(): void {}


    public num_matches() : number {
    
        if(this.matchList)
            return this.matchList.length;
        else return 0;

    }


    public num_friends() : number {

        if(this.friendsList){
            return this.friendsList.length;
        }
        else return 0;
        
    }

    public showChat(chatId: string){
        let url = "/chat/" + chatId; 
        this.router.navigate([url]);
    }

}
