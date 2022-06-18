import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ChatMessageListener } from '../../../core/events/listeners/chat-message';
import { MatchApi } from '../../../core/api/handlers/match-api';
import { Match } from '../../../core/model/match/match';
import { ChatJoinedEmitter } from 'src/app/core/events/emitters/chat-joined';
import { ShotFiredListener } from 'src/app/core/events/listeners/shot-fired';
import { Shot } from 'src/app/core/model/api/match/shot';
import { MatchTerminatedListener } from 'src/app/core/events/listeners/match-terminated';
import { MatchTerminatedData } from 'src/app/core/model/events/match-terminated-data';
import { MatchJoinedEmitter } from 'src/app/core/events/emitters/match-joined';
import { MatchLeftEmitter } from 'src/app/core/events/emitters/match-left';
import { ChatLeftEmitter } from 'src/app/core/events/emitters/chat-left';
import { JoinReason } from '../../../core/model/events/match-joined-data';
import { UserIdProvider } from '../../../core/api/userId-auth/userId-provider';

@Component({
    selector: 'app-observers-screen',
    templateUrl: './observers-screen.component.html',
    styleUrls: ['./observers-screen.component.css'],
})
export class ObserversScreenComponent implements OnInit {
    public matchShowedId: string = '';
    public match?: Match;
    public chatId: string = '';
    public generalEnd: string = '';

    // TODO serve un trigger per ogni component

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userIdProvider: UserIdProvider,
        private matchClient: MatchApi,
        private chatJoinedEmitter: ChatJoinedEmitter,
        private chatLeftEmitter: ChatLeftEmitter,
        private matchJoinedEmitter: MatchJoinedEmitter,
        private matchLeftEmitter: MatchLeftEmitter,
        private chatMessageListener: ChatMessageListener,
        private playersShotListener: ShotFiredListener,
        private matchTerminatedListener: MatchTerminatedListener
    ) {}

    ngOnInit(): void {
        try {
            const matchId: string = this.match?.matchId || '';

            this.route.params.subscribe((params) => {
                this.matchShowedId = params['id'];
            });

            this.matchClient.getMatch(this.matchShowedId).subscribe((data) => {
                this.match = data;

                this.chatId = data.observersChat;
            });

            // Join the new match as a spectator
            this.matchJoinedEmitter.emit({
                matchId: matchId,
                userId: this.userIdProvider.getUserId(),
                joinReason: JoinReason.Spectator,
            });
            this.chatJoinedEmitter.emit({ chatId: this.chatId });

            const pollingPlayerHits = (data: Shot): void => {
                if (data.playerId !== this.match?.player1.playerId)
                    this.match?.player1.grid.shotsReceived.push(data.coordinates);
                else this.match?.player2.grid.shotsReceived.push(data.coordinates);
            };
            pollingPlayerHits.bind(this);
            this.playersShotListener.listen(pollingPlayerHits);

            const pollingMatchResult = async (data: MatchTerminatedData): Promise<void> => {
                const matchId: string = this.match?.matchId || '';
                const path: string = '/match-results/' + matchId;

                this.generalEnd = data.reason.valueOf();

                await this.router.navigate([path]);
            };
            pollingMatchResult.bind(this);
            this.matchTerminatedListener.listen(pollingMatchResult);

            // It should force the chatBody component to refresh
            this.chatMessageListener.listen(() => {
                if (this.match) {
                    this.chatId = this.match?.observersChat;
                } else throw new Error('Observers chat id non existent');
            });
        } catch (err) {
            console.log('An error occurred while retrieving the match: ' + err);
        }
    }

    ngOnDestroy(): void {
        const matchId: string = this.match?.matchId || '';

        this.matchLeftEmitter.emit({ matchId: matchId, userId: this.userIdProvider.getUserId() });
        this.chatLeftEmitter.emit({ chatId: this.chatId });

        this.chatMessageListener.unListen();
        this.matchTerminatedListener.unListen();
        this.playersShotListener.unListen();
    }

    public async quitView() {
        await this.router.navigate(['/relationship']);
    }
}
