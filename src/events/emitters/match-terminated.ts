import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';
import {
    MatchTerminatedData,
    MatchTerminatedReason,
} from '../../model/events/match-terminated-data';
import { GridCoordinates } from '../../model/database/match/state/grid-coordinates';
import { getMatchById, MatchDocument, updateMatchStats } from '../../model/database/match/match';
import { getUserById, getUserByUsername, UserDocument } from '../../model/database/user/user';
import chalk from 'chalk';
import { Ship } from '../../model/database/match/state/ship';
import { BattleshipGrid } from '../../model/database/match/state/battleship-grid';
import { MatchStatsUpdate } from '../../model/api/match/stats-update';
import { toUnixSeconds } from '../../routes/utils/date-utils';

/**
 * Class that wraps socket.io functionality to generate a "match-terminated" event.
 * Such event should be listened by all players and spectators of a match, so they
 * can be notified that the match has ended.
 * This event also handles the update of the match stats, which has to happen
 * when the match ends.
 */
export class MatchTerminatedEmitter extends RoomEmitter<MatchTerminatedData> {
    private readonly matchId: Types.ObjectId;

    /**
     * @param ioServer socket.io server instance
     * @param matchId id of the match whose players and spectators have to be notified
     */
    public constructor(ioServer: Server, matchId: Types.ObjectId) {
        const eventName: string = 'match-terminated';
        super(ioServer, eventName, matchId.toString());

        this.matchId = matchId;
    }

    /**
     * Emits a termination event based on the fact that a player left the match.
     * @param leaverId id of the user that left the match
     */
    public async terminateOnPlayerLeft(leaverId: Types.ObjectId) {
        const currentMatch: MatchDocument = await getMatchById(this.matchId);

        // The winner is the other user with respect to the one who's leaving the match
        const p1Id: Types.ObjectId = currentMatch.player1.playerId;
        const p2Id: Types.ObjectId = currentMatch.player2.playerId;
        const winnerId: Types.ObjectId = p1Id.equals(leaverId) ? p2Id : p1Id;
        const winner: UserDocument = await getUserById(winnerId);

        await this.emit({
            winnerUsername: winner.username,
            reason: MatchTerminatedReason.PlayerLeftTheGame,
        });
    }

    public async emit(data: MatchTerminatedData): Promise<void> {
        try {
            const winner: UserDocument = await getUserByUsername(data.winnerUsername);
            const match: MatchDocument = await getMatchById(this.matchId);

            if (match.stats.endTime !== null) {
                console.log(chalk.bgRed(`Match has already ended! Doing nothing`));

                return;
            }

            const statsUpdate: MatchStatsUpdate = {
                winner: winner._id.toString(),
                endTime: toUnixSeconds(new Date()),
                totalShots: MatchTerminatedEmitter.getTotalShotsFired(match),
                shipsDestroyed: MatchTerminatedEmitter.getTotalShipsDestroyed(match),
            };

            await updateMatchStats(this.matchId, statsUpdate);
        } catch (err) {
            if (err instanceof Error) {
                console.log(
                    chalk.bgRed(
                        `An error occurred while updating the statistics of the match 
                        and sending the termination event. Reason: ${err.message}`
                    )
                );
            }
        }

        super.emit(data);
    }

    /**
     * Returns the total number of shots fired during the match
     * @private
     */
    private static getTotalShotsFired(match: MatchDocument): number {
        const { player1, player2 } = match;
        const p1ReceivedShots: GridCoordinates[] = player1.grid.shotsReceived;
        const p2ReceivedShots: GridCoordinates[] = player2.grid.shotsReceived;

        return p1ReceivedShots.length + p2ReceivedShots.length;
    }

    /**
     * Returns the total number of ships destroyed during the match
     * @private
     */
    private static getTotalShipsDestroyed(match: MatchDocument): number {
        const { player1, player2 } = match;
        let grids: BattleshipGrid[] = [player1.grid, player2.grid];
        let totShipsDestroyed: number = 0;

        // Check each ship of each grid
        grids.forEach((g: BattleshipGrid) => {
            g.ships.forEach((ship: Ship) => {
                if (MatchTerminatedEmitter.isShipDestroyed(ship, g.shotsReceived)) {
                    totShipsDestroyed++;
                }
            });
        });

        return totShipsDestroyed;
    }

    /**
     * Returns true if the provided ship, based on the provided shots received,
     * is destroyed, false otherwise. Destroyed means that all the cells of the ship have been hit.
     * @param ship Ship to check
     * @param shotsReceived Array containing the shots received on the grid
     * @private
     */
    private static isShipDestroyed(ship: Ship, shotsReceived: GridCoordinates[]): boolean {
        const shipRows: number[] = [];
        const shipCols: number[] = [];
        ship.coordinates.forEach((coords: GridCoordinates) => {
            shipRows.push(coords.row);
            shipCols.push(coords.col);
        });

        // Check if shot coordinates are included in both the columns and rows of the ship
        // If this is true, then the shot is a hit
        let hits: number = 0;
        shotsReceived.forEach((shot: GridCoordinates) => {
            if (shipRows.includes(shot.row) && shipCols.includes(shot.col)) {
                hits++;
            }
        });

        // TODO for debug purposes; remove later
        if (hits > ship.coordinates.length) {
            throw new Error("Ship hits shouldn't be higher than the number of pieces of the ships");
        }

        return ship.coordinates.length === hits;
    }
}
