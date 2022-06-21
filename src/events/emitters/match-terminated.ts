import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';
import {
    MatchTerminatedData,
    MatchTerminatedReason,
} from '../../model/events/match-terminated-data';
import { GridCoordinates } from '../../model/database/match/state/grid-coordinates';
import { getMatchById, MatchDocument, updateMatchStats } from '../../model/database/match/match';
import {
    addMatchStats,
    getUserById,
    getUserByUsername,
    UserDocument,
} from '../../model/database/user/user';
import chalk from 'chalk';
import { Ship } from '../../model/database/match/state/ship';
import { BattleshipGrid } from '../../model/database/match/state/battleship-grid';
import { MatchStatsUpdate } from '../../model/api/match/stats-update';
import { toUnixSeconds } from '../../routes/utils/date-utils';
import { PlayerStateSubDocument } from '../../model/database/match/state/player-state';

interface PlayerShipsStats {
    /**
     * Number of hits on the ships
     */
    hits: number;

    /**
     * Number of ships destroyed
     */
    destroyed: number;
}

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
                console.log(chalk.bgYellow(`Match has already ended! Doing nothing`));

                return;
            }

            // Get the stats of each player and aggregate them to create the match stats
            const p1ShotsReceived: number = MatchTerminatedEmitter.getPlayerShotsReceived(
                match.player1
            );
            const p2ShotsReceived: number = MatchTerminatedEmitter.getPlayerShotsReceived(
                match.player2
            );

            // NOTE: These are the stats relative to the ships OF the player,
            // not the ships hit/destroyed BY the player
            const p1ShipsStats: PlayerShipsStats = MatchTerminatedEmitter.getPlayerShipsStats(
                match.player1
            );
            const p2ShipsStats: PlayerShipsStats = MatchTerminatedEmitter.getPlayerShipsStats(
                match.player2
            );

            const totalShots: number = p1ShotsReceived + p2ShotsReceived;
            const totalShipsDestroyed: number = p1ShipsStats.destroyed + p2ShipsStats.destroyed;
            const statsUpdate: MatchStatsUpdate = {
                winner: winner._id.toString(),
                endTime: toUnixSeconds(new Date()),
                totalShots: totalShots,
                shipsDestroyed: totalShipsDestroyed,
            };

            // Update match stats
            await updateMatchStats(this.matchId, statsUpdate);

            // Update the stats of each player
            const { player1, player2 } = match;
            const isP1Winner: boolean = winner._id.equals(player1.playerId);

            // Add the stats of a player to its opponent
            await addMatchStats(
                player1.playerId,
                p2ShipsStats.destroyed,
                p2ShotsReceived,
                p2ShipsStats.hits,
                isP1Winner
            );
            await addMatchStats(
                player2.playerId,
                p1ShipsStats.destroyed,
                p1ShotsReceived,
                p1ShipsStats.hits,
                !isP1Winner
            );
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
     * Returns the total number of shots received by a player during the match
     * @private
     */
    private static getPlayerShotsReceived(player: PlayerStateSubDocument): number {
        return player.grid.shotsReceived.length;
    }

    /**
     * Returns the total number of ships destroyed of the provided player.
     *
     * NOTE: this number does not refer to the ships destroyed BY the player, but
     *  to the ships OF the player that were destroyed
     * @private
     */
    private static getPlayerShipsStats(player: PlayerStateSubDocument): PlayerShipsStats {
        let grid: BattleshipGrid = player.grid;
        let totShipsDestroyed: number = 0;
        let totalHits: number = 0;

        grid.ships.forEach((ship: Ship) => {
            const hitsOnShip: number = MatchTerminatedEmitter.getHitsOnShip(
                ship,
                grid.shotsReceived
            );
            totalHits += hitsOnShip;

            if (MatchTerminatedEmitter.isShipDestroyed(ship, hitsOnShip)) {
                totShipsDestroyed++;
            }
        });

        return {
            hits: totalHits,
            destroyed: totShipsDestroyed,
        };
    }

    /**
     * Returns the total number of hits on the provided ship
     * @param ship
     * @param shotsReceived
     * @private
     */
    private static getHitsOnShip(ship: Ship, shotsReceived: GridCoordinates[]): number {
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

        if (hits > ship.coordinates.length) {
            throw new Error("Ship hits shouldn't be higher than the number of pieces of the ships");
        }

        return hits;
    }

    /**
     * Returns true if the provided ship, based on the provided number of hits,
     * is destroyed, false otherwise. Destroyed means that all the cells of the ship have been hit.
     * @param ship Ship to check
     * @param hits number of hits received by the ship
     * @private
     */
    private static isShipDestroyed(ship: Ship, hits: number): boolean {
        if (hits > ship.coordinates.length) {
            throw new Error("Ship hits shouldn't be higher than the number of pieces of the ships");
        }

        return ship.coordinates.length === hits;
    }
}
