import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { HtmlErrorMessage } from '../../../core/model/utils/htmlErrorMessage';
import { GridCoordinates } from '../../../../../../src/model/database/match/state/grid-coordinates';
import { BattleshipGrid } from '../../../core/model/match/battleship-grid';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { MatchLeftEmitter } from 'src/app/core/events/emitters/match-left';
import { PlayerWonEmitter } from 'src/app/core/events/emitters/player-won';
import { Match } from 'src/app/core/model/match/match';
import { MatchApi } from 'src/app/core/api/handlers/match-api';
import { ShotFiredListener } from 'src/app/core/events/listeners/shot-fired';
import { ShotData } from 'src/app/core/model/events/shot-data';
import { MatchLeftData } from '../../../core/model/events/match-left-data';
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

                    let rnd: number = this.match.matchId.charCodeAt(0);

                    if (rnd % 2 == 0) {
                        this.playerTurn = this.match.player1.playerId === this.userInSessionId;
                    } else {
                        this.playerTurn = this.match.player2.playerId === this.userInSessionId;
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

                        // Mark the shot as a hit only if the player
                        // who shot it is the opponent
                        if (this.userInSessionId !== data.playerId) {
                            this.shipsCoordinates = this.shipsCoordinates.filter((e) => {
                                const isHit: boolean =
                                    e.row === data.coordinates.row &&
                                    e.col === data.coordinates.col;

                                return !isHit;
                            });
                        }

                        if (this.shipsCoordinates.length === 0) {
                            this.lostAndSauced();
                        }
                        this.trigger++;
                        this.playerTurn = !this.playerTurn;
                    };
                    pollingOpponentHits.bind(this);
                    this.shotListener.listen(pollingOpponentHits);
                });
            });
        } catch (err) {
            console.log('An error occurred while initializing the game screen: ' + err);
        }
    }

    ngOnDestroy(): void {
        this.shotListener.unListen();
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

    private parseRow(coord: string): number {
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
            default: {
                this.userMessage.error = true;
                this.userMessage.errorMessage = 'Position is invalid';
                return -1;
            }
        }
    }

    private parseCol(coord: string): number {
        let val = Number(coord) - 1;
        if (!isNaN(val) && val >= 0 && val <= 9) return val;
        else {
            this.userMessage.error = true;
            this.userMessage.errorMessage = 'Position is invalid';
            return -1;
        }
    }

    public shot(row: string, col: string) {
        this.userMessage.error = false;
        let shotRow: number = this.parseRow(row);
        let shotCol: number = this.parseCol(col);

        if (this.isValidCoords(shotRow, shotCol)) {
            this.matchApi
                .fireShot(this.match.matchId, {
                    playerId: this.userInSessionId,
                    coordinates: { row: shotRow, col: shotCol },
                })
                .subscribe({
                    error: (err) => {
                        this.userMessage.error = true;
                        this.userMessage.errorMessage =
                            '(' + row.toUpperCase() + ', ' + col + ') has already been shot';
                    },
                });
        } else {
            this.userMessage.error = true;
            this.userMessage.errorMessage = 'Invalid Coordinates';
        }
    }

    public async leaveMatch() {
        if (this.match.matchId !== undefined) {
            const matchLeftData: MatchLeftData = {
                matchId: this.match.matchId,
                userId: this.userInSessionId,
            };

            this.leaveMatchEmitter.emit({
                matchId: this.match.matchId,
                userId: this.userInSessionId,
            });

            await this.redirectToHomePage();
        } else {
            throw new Error('MatchId not found');
        }
    }

    private async redirectToHomePage() {
        await this.router.navigate(['/homepage']);
    }

    private lostAndSauced() {
        if (this.match !== undefined) {
            this.playerWonEmitter.emit({
                winnerId: this.opponentsId,
                matchId: this.match.matchId,
            });
        } else {
            throw new Error('Match has not been set');
        }
    }
}
