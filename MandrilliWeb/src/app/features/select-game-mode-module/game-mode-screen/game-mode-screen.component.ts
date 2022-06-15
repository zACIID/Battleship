import { MatchData } from './../../../core/model/events/match-data';
import { UserIdProvider } from './../../../core/api/userId-auth/userId-provider';
import { MatchmakingApi, EnqueueResponse } from './../../../core/api/handlers/matchmaking-api';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatchFoundListener } from 'src/app/core/events/listeners/match-found';

@Component({
    selector: 'app-game-mode-screen',
    templateUrl: './game-mode-screen.component.html',
    styleUrls: ['./game-mode-screen.component.css'],
})
export class GameModeScreenComponent implements OnInit {

    public userInSessionId: string = "";

    constructor(
        private matchListener: MatchFoundListener, 
        private router: Router,
        private queue: MatchmakingApi,
        private userIdProvider: UserIdProvider
    ) {}

    ngOnInit(): void {
        this.userInSessionId = this.userIdProvider.getUserId();
    }

    ngOnDestroy() : void {
        this.matchListener.unListen()
    }

    public startMatchMaking() {

        this.queue.enqueue(this.userInSessionId).subscribe((res: EnqueueResponse) => {

            const matchFound = async (data: MatchData): Promise<void> => {
                let reqpath = 'preparation-phase/' + data.matchId;
                await this.router.navigate([reqpath]);
            }
            matchFound.bind(this);

            this.matchListener.listen(matchFound);
        })
        
    }
}
