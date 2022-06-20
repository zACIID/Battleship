import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserIdProvider } from '../../../core/api/userId-auth/userId-provider';
import { Overview } from '../../../core/model/user/overview';
import { MatchData } from '../../../core/model/events/match-data';
import { JoinReason } from '../../../core/model/events/match-joined-data';
import { MatchTerminatedData } from '../../../core/model/events/match-terminated-data';
import { MatchTerminatedListener } from '../../../core/events/listeners/match-terminated';
import { MatchJoinedEmitter } from '../../../core/events/emitters/match-joined';
import { MatchFoundListener } from '../../../core/events/listeners/match-found';

@Component({
    selector: 'app-homepage-screen',
    templateUrl: './homepage-screen.component.html',
    styleUrls: ['./homepage-screen.component.css'],
})
export class HomepageScreenComponent implements OnInit {
    public user: Overview = new Overview();
    public userInSessionId: string = '';

    constructor(
        private router: Router,
        private userIdProvider: UserIdProvider,
        private matchListener: MatchFoundListener,
        private matchTerminatedListener: MatchTerminatedListener,
        private matchJoined: MatchJoinedEmitter
    ) {}

    ngOnInit(): void {
        this.userInSessionId = this.userIdProvider.getUserId();

        // match-found event should be listened right as the user enters the app.
        // This is because another user can accept a match at any time,
        // even after the current user has logged out and logged in multiple times.
        const matchFound = async (matchFoundData: MatchData): Promise<void> => {
            console.log('Match found');

            // Join the new match as a player
            this.matchJoined.emit({
                matchId: matchFoundData.matchId,
                userId: this.userInSessionId,
                joinReason: JoinReason.Player,
            });

            await this.redirectToPrepPhaseScreen(matchFoundData.matchId);

            // Also listen to the match terminated event. It could happen
            // At any moment after the match has started
            const onMatchTerminated = async (termData: MatchTerminatedData) => {
                // remember to un-listen after this event, else there is a redirection
                // to another screen and the listener is still registered
                this.matchTerminatedListener.unListen();

                console.log(`Match terminated. Reason: ${termData.reason}`);
                console.log(`Player '${termData.winnerUsername}' has won the game`);

                await this.redirectToMatchResultScreen(matchFoundData.matchId);
            };
            onMatchTerminated.bind(this);
            this.matchTerminatedListener.listen(onMatchTerminated);
        };
        matchFound.bind(this);
        this.matchListener.listen(matchFound);
    }

    private async redirectToPrepPhaseScreen(matchId: string) {
        const path: string = `/preparation-phase/${matchId}`;

        await this.router.navigate([path]);
    }

    private async redirectToMatchResultScreen(matchId: string) {
        const path: string = `/match-results/${matchId}`;

        await this.router.navigate([path]);
    }
}
