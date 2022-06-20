import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { MatchJoinedEmitter } from '../emitters/match-joined';
import { MatchFoundListener } from '../listeners/match-found';
import { MatchTerminatedListener } from '../listeners/match-terminated';
import { UserIdProvider } from '../../api/userId-auth/userId-provider';
import { MatchData } from '../../model/events/match-data';
import { JoinReason } from '../../model/events/match-joined-data';
import { MatchTerminatedData } from '../../model/events/match-terminated-data';
import { MatchLeftEmitter } from '../emitters/match-left';

/**
 * Class that helps to handle all the match-join related event handlers.
 * This is injected at the root of the application, so it is effectively a singleton
 * that keeps a reference to all the listeners.
 */
@Injectable({
    providedIn: 'root',
})
export class MatchJoinHelper {
    constructor(
        private userIdProvider: UserIdProvider,
        private matchFound: MatchFoundListener,
        private matchJoined: MatchJoinedEmitter,
        private matchLeftEmitter: MatchLeftEmitter,
        private matchTerminated: MatchTerminatedListener,
        private router: Router
    ) {}

    /**
     * Sets up all the match-join related event handlers, notably:
     * - listening for the match found event;
     * - joining a match when found;
     * - listening for the match terminated event after the match has been found;
     * - leaving the match after it has terminated;
     * - handling all the redirections associated with such events.
     */
    public setupEventHandlers() {
        // match-found event should be listened right as the user enters the app.
        // This is because another user can accept a match at any time,
        // even after the current user has logged out and logged in multiple times.
        const onMatchFound = async (matchFoundData: MatchData): Promise<void> => {
            console.log('Match found');
            const currentUserId: string = this.userIdProvider.getUserId();

            // Join the new match as a player
            this.matchJoined.emit({
                matchId: matchFoundData.matchId,
                userId: currentUserId,
                joinReason: JoinReason.Player,
            });

            await this.redirectToPrepPhaseScreen(matchFoundData.matchId);

            // Also listen to the match terminated event. It could happen
            // At any moment after the match has started
            const onMatchTerminated = async (termData: MatchTerminatedData) => {
                // remember to un-listen after this event, else there is a redirection
                // to another screen and the listener is still registered
                this.matchTerminated.unListen();

                console.log(`Match terminated. Reason: ${termData.reason}`);
                console.log(`Player '${termData.winnerUsername}' has won the game`);

                // Since the match has ended, notify the server that
                // the current user is leaving the match
                this.matchLeftEmitter.emit({
                    matchId: matchFoundData.matchId,
                    userId: currentUserId,
                });

                await this.redirectToMatchResultScreen(matchFoundData.matchId);
            };
            onMatchTerminated.bind(this);
            this.matchTerminated.listen(onMatchTerminated);
        };
        onMatchFound.bind(this);
        this.matchFound.listen(onMatchFound);
    }

    private async redirectToPrepPhaseScreen(matchId: string) {
        const path: string = `/preparation-phase/${matchId}`;

        await this.router.navigate([path]);
    }

    private async redirectToMatchResultScreen(matchId: string) {
        const path: string = `/match-results/${matchId}`;

        await this.router.navigate([path]);
    }

    /**
     * Tears down all the match-join related event handlers.
     */
    public teardownEventHandlers() {
        this.matchTerminated.unListen();
        this.matchFound.unListen();
    }
}
