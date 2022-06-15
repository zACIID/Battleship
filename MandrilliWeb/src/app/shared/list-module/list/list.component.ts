import { UserIdProvider } from './../../../core/api/userId-auth/userId-provider';
import { FriendRequestAcceptedEmitter } from './../../../core/events/emitters/friend-request-accepted';
import { NotificationApi } from './../../../core/api/handlers/notification-api';
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
    public userId: string = '';
    @Input() matchList?: MatchOverview[];
    @Input() friendsList?: RelationshipOverview[];
    @Input() notificationList?: NotificationOverview[];

    /* TODO 
     * Ognuno degli amici nella lista dovrebbe avere un bottone "osserva la partita"
     * con il matchId della partita che si vuole spectare.
     * Come ottengo il matchId della partita di un altro soggetto ? 
    */


    /** Particular props for accepting or refusing an incoming notification */
    @Input() accept?: Function;
    @Input() refuse?: Function;

    constructor(
        private router: Router,
        private notificationApi: NotificationApi,
        private friendAcceptClient: FriendRequestAcceptedEmitter,
        private userIdProvider: UserIdProvider    
    ) {}

    ngOnInit(): void {
        this.userId = this.userIdProvider.getUserId();
    }

    public num_matches(): number {
        if (this.matchList) return this.matchList.length;
        else return 0;
    }

    public num_friends(): number {
        if (this.friendsList) {
            return this.friendsList.length;
        } else return 0;
    }

    public async showChat(chatId: string) {
        let url = '/chat/' + chatId;
        await this.router.navigate([url]);
    }
}
