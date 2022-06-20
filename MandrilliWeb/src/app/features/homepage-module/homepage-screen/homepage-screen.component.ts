import { MatchFoundListener } from './../../../core/events/listeners/match-found';
import { JoinReason } from './../../../../../../src/model/events/match-joined-data';
import { MatchJoinedEmitter } from './../../../core/events/emitters/match-joined';
import { MatchData } from './../../../../../../src/model/events/match-data';
import { UserIdProvider } from '../../../core/api/userId-auth/userId-provider';
import { Overview } from '../../../core/model/user/overview';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-homepage-screen',
    templateUrl: './homepage-screen.component.html',
    styleUrls: ['./homepage-screen.component.css'],
})
export class HomepageScreenComponent implements OnInit {
    public user: Overview = new Overview();
    public userInSessionId: string = '';

    constructor(
        private userIdProvider: UserIdProvider,
        private matchJoined: MatchJoinedEmitter,
        private router: Router,
        private matchListener: MatchFoundListener
    ) {}

    ngOnInit(): void {
        this.userInSessionId = this.userIdProvider.getUserId();

        const matchFound = async (data: MatchData): Promise<void> => {
            console.log('Match found');

            // Join the new match as a player
            this.matchJoined.emit({
                matchId: data.matchId,
                userId: this.userInSessionId,
                joinReason: JoinReason.Player,
            });

            let reqPath = '/preparation-phase/' + data.matchId;
            await this.router.navigate([reqPath]);
        };
        matchFound.bind(this);
        this.matchListener.listen(matchFound);
    }
}
