import { Server } from 'socket.io';
import chalk from 'chalk';

import {
    MatchmakingQueueModel,
    QueueEntry,
    removeMultipleMatchmakingEntries,
} from '../model/database/matchmaking/queue-entry';
import * as match from '../model/database/match/match';
import { MatchFoundEmitter } from '../events/emitters/match-found';
import { MatchData } from '../model/events/match-data';
import { EngineAlreadyStartedError, EngineAlreadyStoppedError } from './engine-errors';

/**
 * Class that represents a matchmaking engine, whose purpose is to arrange game
 * between players with about the same skill level.
 * It scans the matchmaking queue in the database and looks for arrangements.
 * If it can find two players suitable for a match, such match is created
 * and the two players are notified.
 */
export class MatchmakingEngine {
    /**
     * Identifier for the interval that is currently running the matchmaking engine.
     * Null if no interval is active.
     * @private
     */
    private intervalId: NodeJS.Timeout;

    /**
     * Time in milliseconds that passes between each run of the
     * matchmaking engine.
     * @private
     */
    private readonly pollingTime: number;

    /**
     * socket.io handler server tha will be used by the engine to notify
     *  players that a match has been found.
     * @private
     */
    private readonly sIoServer: Server;

    /**
     * If true, the engine logs statements on the console
     * @private
     */
    private readonly verbose: boolean;

    /**
     * Creates a matchmaking engine instance
     *
     * @param sIoServer socket.io server instance tha will be used by the engine to notify
     *  players that a match has been found
     * @param queuePollingTime Time in milliseconds that passes between each run of the
     *  matchmaking engine.
     * @param verbose If true, the engine logs statements on the console
     */
    public constructor(
        sIoServer: Server,
        queuePollingTime: number = 5000,
        verbose: boolean = false
    ) {
        this.intervalId = null;
        this.pollingTime = queuePollingTime;
        this.sIoServer = sIoServer;
        this.verbose = verbose;
    }

    /**
     * Starts the matchmaking engine, which keeps trying to arrange matches between
     * queued players, on a frequency defined by the queue polling time specified
     * at initialization.
     */
    public start(): void {
        this.log('Starting the engine...');

        if (this.intervalId !== null) {
            throw new EngineAlreadyStartedError();
        }

        this.refreshQueueScan();
    }

    /**
     * Calls setTimeout with the function that arranges the matches between
     * the users in the queue and clears the interval of the previous call.
     * @private
     */
    private refreshQueueScan() {
        clearInterval(this.intervalId);

        this.intervalId = setTimeout(
            async function () {
                await this.scanQueue();
            }.bind(this),
            this.pollingTime
        );
    }

    /**
     * Scans the matchmaking queue and tries to arrange matches between queued users.
     * If two players are suitable for a game, determined by an elo-based matchmaking criteria,
     * the match is created and the two players are notified.
     * @private
     */
    private async scanQueue(): Promise<void> {
        this.log('Looking for players to match...');

        // Queued players, ordered by most recent
        // This way, the one that has been queuing for the longest time has the priority,
        // because, being the last in the queue, will be popped first
        let queuedPlayers: QueueEntry[] = await MatchmakingQueueModel.find({}).sort({
            queuedSince: 1,
        });

        // Until there are at least 2 players in the queue,
        // keep trying to arrange matches
        while (queuedPlayers.length > 1) {
            this.log(`Arranging matches (${queuedPlayers.length} players in the queue)...`);

            const player: QueueEntry = queuedPlayers.pop();
            const opponent: QueueEntry = this.findOpponent(player, queuedPlayers);

            if (opponent !== null) {
                this.log(chalk.blue(`Creating match for ${player.userId} and ${opponent.userId}`));
                this.log(chalk.blue(`Queue entries: ${player} | ${opponent}`));

                await this.arrangeMatch(player, opponent);

                // Remove the entries of the two players from the queue,
                // both in the database and in memory
                await removeMultipleMatchmakingEntries([player.userId, opponent.userId]);
                queuedPlayers = queuedPlayers.filter((entry: QueueEntry) => {
                    return entry.userId !== player.userId && entry.userId !== opponent.userId;
                });
            }
        }

        // Scan terminated: refresh the timeout on this function
        this.refreshQueueScan();
    }

    /**
     * Finds an opponent for the specified player and returns it.
     *
     * @param player player to find an opponent for
     * @param restOfTheQueue rest of the matchmaking queue (player excluded)
     * @private
     * @returns the opponent for the specified player, if found, else null
     */
    private findOpponent(player: QueueEntry, restOfTheQueue: QueueEntry[]): QueueEntry {
        this.log(chalk.magenta(`Finding opponent for player: ${JSON.stringify(player)}`));

        const potentialOpponents: QueueEntry[] = this.getPotentialOpponents(player, restOfTheQueue);

        this.log(chalk.magenta(`Potential opponents: ${JSON.stringify(potentialOpponents)}`));

        if (potentialOpponents.length === 0) {
            return null;
        }

        // Sort in ascending order based on time of queue
        potentialOpponents.sort((a: QueueEntry, b: QueueEntry) => {
            if (a.queuedSince < b.queuedSince) {
                return -1;
            } else if (a.queuedSince > b.queuedSince) {
                return 1;
            } else {
                return 0;
            }
        });

        // Returning the first potential opponent means
        // getting the one that was queued for the longest time
        return potentialOpponents[0];
    }

    /**
     * Returns a list of potential opponents for the provided player, by
     * applying an elo-based matchmaking criteria.
     *
     * @param player player to find the potential opponents for
     * @param restOfTheQueue all the other players in-queue
     * @private
     * @return new array containing the shallow copy of the entries in the rest of the queue
     *  that can be matched with the player
     */
    private getPotentialOpponents(player: QueueEntry, restOfTheQueue: QueueEntry[]): QueueEntry[] {
        return restOfTheQueue.filter((entry) => {
            return this.arePlayersMatchable(player, entry);
        });
    }

    /**
     * Returns true if the specified players are similarly skilled.
     * In this case, skill is based on elo.
     *
     * @param p1
     * @param p2
     * @private
     */
    private arePlayersMatchable(p1: QueueEntry, p2: QueueEntry): boolean {
        const p1EloDelta: number = this.getEloDelta(p1);
        const p2EloDelta: number = this.getEloDelta(p2);
        const eloDiff: number = Math.abs(p1.elo - p2.elo);

        const isP1Skill: boolean = eloDiff <= p1EloDelta;
        const isP2Skill: boolean = eloDiff <= p2EloDelta;

        return isP1Skill && isP2Skill;
    }

    /**
     * Returns the elo delta of some player, which is the maximum elo difference
     * that a player can have with another for them to be considered suitable for matchmaking.
     * E.g. if a player is 1500elo with an eloDelta of 200, this means that he can match with
     *  players 1500 +- 200 elo.
     *
     *  Also, delta is dependent on time spent in queue: a player that has been in queue for
     *  a long time has a wider delta, which means he should find a match more easily.
     *
     * @param player
     * @private
     */
    private getEloDelta(player: QueueEntry): number {
        const startingDelta: number = 100;
        const timeBeforeIncreaseMs: number = this.pollingTime;

        // Delta's multiplier depends on time spent in queue
        // The more time he spent there, the more the delta is wide,
        // which means that a match should be found more easily
        const timeSpentInQueueMs: number = Date.now() - player.queuedSince.getMilliseconds();
        const multiplier = Math.ceil(timeSpentInQueueMs / timeBeforeIncreaseMs);

        return startingDelta * multiplier;
    }

    /**
     * Creates a match between the specified players and notifies them that
     * a match has been found
     *
     * @param player1
     * @param player2
     * @private
     */
    private async arrangeMatch(player1: QueueEntry, player2: QueueEntry): Promise<void> {
        const createdMatch: match.MatchDocument = await match.createMatch(
            player1.userId,
            player2.userId
        );
        const notificationData: MatchData = {
            matchId: createdMatch._id,
        };

        this.log(chalk.green('Match Found: sending notifications to the players'));

        const player1Notifier: MatchFoundEmitter = new MatchFoundEmitter(
            this.sIoServer,
            player1.userId
        );
        player1Notifier.emit(notificationData);

        const player2Notifier: MatchFoundEmitter = new MatchFoundEmitter(
            this.sIoServer,
            player2.userId
        );
        player2Notifier.emit(notificationData);
    }

    /**
     * Stops the engine from arranging matches
     */
    public stop(): void {
        this.log('Stopping the engine...');

        if (this.intervalId === null) {
            throw new EngineAlreadyStoppedError();
        }

        clearInterval(this.intervalId);

        this.intervalId = null;
    }

    private log(message: string): void {
        if (this.verbose) {
            console.log(`[Matchmaking Engine] ${message}`);
        }
    }
}
