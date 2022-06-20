import { ActivatedRoute, Router } from '@angular/router';

import { ChatMessageListener } from '../../../core/events/listeners/chat-message';
import { HtmlErrorMessage } from '../../../core/model/utils/htmlErrorMessage';
import { GridCoordinates } from '../../../../../../src/model/database/match/state/grid-coordinates';
import { BattleshipGrid } from '../../../core/model/match/battleship-grid';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { MatchLeftEmitter } from 'src/app/core/events/emitters/match-left';
import { PlayerWonEmitter } from 'src/app/core/events/emitters/player-won';
import { Match } from 'src/app/core/model/match/match';
import { MatchApi } from 'src/app/core/api/handlers/match-api';
import { ShotFiredListener } from 'src/app/core/events/listeners/shot-fired';
import { ShotData } from 'src/app/core/model/events/shot-data';
import { ChatJoinedEmitter } from 'src/app/core/events/emitters/chat-joined';
import { MatchTerminatedListener } from '../../../core/events/listeners/match-terminated';
@Component({
    selector: 'app-game-screen',
    templateUrl: './game-screen.component.html',
    styleUrls: ['./game-screen.component.css'],
})
export class GameScreenComponent implements OnInit, OnDestroy {
    public userInSessionId: string = '';
    private match: Match = new Match();
    public playerGrid: BattleshipGrid = new BattleshipGrid();
    public opponentGrid: BattleshipGrid = new BattleshipGrid();
    public opponentsId: string = '';
    public trigger: number = 0;
    public chatId?: string = undefined;
    private shipsCoordinates: GridCoordinates[] = [];
    public userMessage: HtmlErrorMessage = new HtmlErrorMessage();
    public playerTurn?: boolean;

    constructor(
        private route: ActivatedRoute,
        private chatMessageListener: ChatMessageListener,
        private matchTerminatedListener: MatchTerminatedListener,
        private chatMessageEmitter: ChatJoinedEmitter,
        private leaveMatchEmitter: MatchLeftEmitter,
        private playerWonEmitter: PlayerWonEmitter,
        private userIdProvider: UserIdProvider,
        private matchApi: MatchApi,
        private router: Router,
        private shotListener: ShotFiredListener
    ) {}

    ngOnInit(): void {
        try {
            this.userInSessionId = this.userIdProvider.getUserId();

            this.route.params.subscribe((params) => {
                this.match.matchId = params['id'];

                this.matchApi.getMatch(this.match.matchId).subscribe((data) => {
                    this.match = data;
                    if (data.player1.playerId === this.userInSessionId) {
                        this.playerGrid = data.player1.grid;
                        this.opponentGrid = data.player2.grid;
                        this.opponentsId = data.player2.playerId;
                    } else {
                        this.playerGrid = data.player2.grid;
                        this.opponentGrid = data.player1.grid;
                        this.opponentsId = data.player1.playerId;
                    }
                    this.chatId = data.playersChat;
                    this.chatMessageEmitter.emit({ chatId: this.match.playersChat });

                    let rnd: number = this.match.matchId.charCodeAt(0);

                    if (rnd % 2 == 0) {
                        if (this.match.player1.playerId === this.userInSessionId)
                            this.playerTurn = true;
                        else this.playerTurn = false;
                    } else {
                        if (this.match.player2.playerId === this.userInSessionId)
                            this.playerTurn = true;
                        else this.playerTurn = false;
                    }

                    for (let ships of this.playerGrid.ships) {
                        for (let coord of ships.coordinates) {
                            this.shipsCoordinates.push(coord);
                        }
                    }

                    const pollingOpponentHits = (data: ShotData) => {
                        if (this.match.player1.playerId !== data.playerId) {
                            this.match.player1.grid.shotsReceived.push(data.coordinates);
                        } else this.match.player2.grid.shotsReceived.push(data.coordinates);

                        this.shipsCoordinates = this.shipsCoordinates.filter(
                            (e) => e.row !== data.coordinates.row && e.col !== data.coordinates.col
                        );

                        if (this.shipsCoordinates.length === 0) {
                            this.lostAndSauced();
                        }
                        this.trigger++;
                        this.playerTurn = !this.playerTurn;
                    };
                    pollingOpponentHits.bind(this);
                    this.shotListener.listen(pollingOpponentHits);
                });

                const refreshChat = () => {
                    this.trigger++;
                };
                refreshChat.bind(this);
                this.chatMessageListener.listen(refreshChat);
            });
        } catch (err) {
            console.log('An error occurred while initializing the game screen: ' + err);
        }
    }

    private async redirectToMatchResultScreen() {
        const path: string = '/match-results/' + this.match.matchId;

        await this.router.navigate([path]);
    }

    ngOnDestroy(): void {
        this.shotListener.unListen();
        this.chatMessageListener.unListen();
        this.matchTerminatedListener.unListen();
    }

    private isValidCoords(row: number, col: number): boolean {
        if (!isNaN(row) && !isNaN(col)) {
            if (row <= 9 && row >= 0 && col <= 9 && col >= 0) {
                return true;
            }
        }
        this.userMessage.errorMessage = 'Fire position is invalid: out of bound';
        return false;
    }

    private parseCoord(coord: string): number {
        coord = coord.toUpperCase();
        switch (coord) {
            case 'A':
                return 0;
            case 'B':
                return 1;
            case 'C':
                return 2;
            case 'D':
                return 3;
            case 'E':
                return 4;
            case 'F':
                return 5;
            case 'G':
                return 6;
            case 'H':
                return 7;
            case 'I':
                return 8;
            case 'J':
                return 9;
            default:
                return Number(coord) - 1;
        }
    }

    public shot(row: string, col: string) {
        this.userMessage.error = false;
        let shotRow: number = this.parseCoord(row);
        let shotCol: number = this.parseCoord(col);

        if (this.isValidCoords(shotRow, shotCol)) {
            this.matchApi
                .fireShot(this.match.matchId, {
                    playerId: this.userInSessionId,
                    coordinates: { row: shotRow, col: shotCol },
                })
                .subscribe({error: (err) => {
                    this.userMessage.error = true;
                    this.userMessage.errorMessage = "(" + row.toUpperCase() + ", " + col + ") has already been shot";
                }});
        }
    }

    public async leaveMatch() {
        if (this.match.matchId)
            this.leaveMatchEmitter.emit({
                matchId: this.match.matchId,
                userId: this.userInSessionId,
            });
        else {
            throw new Error('MatchId not found');
        }

        await this.redirectToMatchResultScreen();
    }

    private lostAndSauced() {
        if (this.match !== undefined) {
            this.playerWonEmitter.emit({
                winnerId: this.opponentsId,
                matchId: this.match.matchId,
            });

            this.leaveMatchEmitter.emit({
                matchId: this.match.matchId,
                userId: this.userInSessionId,
            });
        } else {
            throw new Error('Match has not been set');
        }
    }
}
