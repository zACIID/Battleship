import { UserIdProvider } from '../../../core/api/userId-auth/userId-provider';
import { EnqueueResponse, MatchmakingApi } from '../../../core/api/handlers/matchmaking-api';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-game-mode-screen',
    templateUrl: './game-mode-screen.component.html',
    styleUrls: ['./game-mode-screen.component.css'],
})
export class GameModeScreenComponent implements OnInit, OnDestroy {
    public userInSessionId: string = '';
    public inQueue: boolean = false;

    constructor(
        private router: Router,
        private queue: MatchmakingApi,
        private userIdProvider: UserIdProvider
    ) {}

    ngOnInit(): void {
        this.userInSessionId = this.userIdProvider.getUserId();
    }

    ngOnDestroy(): void {
        this.queue.removeFromQueue(this.userIdProvider.getUserId()).subscribe();
    }

    public startMatchmaking() {
        if (!this.inQueue) {
            let btn = document.getElementById('casual-button');
            if (btn) {
                btn.textContent = 'In queue';
            }

            this.queue.enqueue(this.userInSessionId).subscribe((res: EnqueueResponse) => {});
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
