import { MatchData } from '../../../core/model/events/match-data';
import { UserIdProvider } from '../../../core/api/userId-auth/userId-provider';
import { EnqueueResponse, MatchmakingApi } from '../../../core/api/handlers/matchmaking-api';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatchFoundListener } from 'src/app/core/events/listeners/match-found';
import { MatchJoinedEmitter } from '../../../core/events/emitters/match-joined';
import { JoinReason } from '../../../core/model/events/match-joined-data';

@Component({
    selector: 'app-game-mode-screen',
    templateUrl: './game-mode-screen.component.html',
    styleUrls: ['./game-mode-screen.component.css'],
})
export class GameModeScreenComponent implements OnInit {
    public userInSessionId: string = '';
    public inQueue: boolean = false;

    constructor(
        private matchListener: MatchFoundListener,
        private matchJoined: MatchJoinedEmitter,
        private router: Router,
        private queue: MatchmakingApi,
        private userIdProvider: UserIdProvider
    ) {}

    ngOnInit(): void {
        this.userInSessionId = this.userIdProvider.getUserId();
    }

    ngOnDestroy(): void {
        this.matchListener.unListen();
        this.queue.removeFromQueue(this.userIdProvider.getUserId()).subscribe();
    }

    public startMatchmaking() {
        if (!this.inQueue) {
            let btn = document.getElementById('casual-button');
            if (btn) {
                btn.textContent = 'In queue';
            }

            this.queue.enqueue(this.userInSessionId).subscribe((res: EnqueueResponse) => {
                // TODO match-found should be listened right after login
                //  this is because another user can accept a match at any time,
                //  even after the current user has logged out and logged in multiple times
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
            });
            this.inQueue = true;
        }
    }

    public endMatchmaking() {
        this.queue.removeFromQueue(this.userIdProvider.getUserId()).subscribe();
        this.inQueue = false;
        let btn = document.getElementById('casual-button');
        if (btn) {
            btn.textContent = 'Casual game';
        }
    }
}
