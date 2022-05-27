import { mquery, Schema, Types } from "mongoose";
import { Server } from "socket.io";

import { MatchmakingQueueModel, QueueEntry } from "../models/matchmaking/queue-entry";
import * as match from "../models/match/match";
import { MatchFoundEmitter, MatchFoundNotificationData } from "./socket-io/emitters/match-found-emitter";


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
    private _intervalId: NodeJS.Timeout;

    /**
     * Time in milliseconds that passes between each run of the
     * matchmaking engine.
     * @private
     */
    private readonly _pollingTime: number;

    /**
     * Socket.io handler server tha will be used by the engine to notify
     *  players that a match has been found.
     * @private
     */
    private readonly _sIoServer: Server;

    /**
     * Creates a matchmaking engine instance
     *
     * @param sIoServer Socket.io server instance tha will be used by the engine to notify
     *  players that a match has been found
     * @param queuePollingTime Time in milliseconds that passes between each run of the
     *  matchmaking engine.
     */
    public constructor(sIoServer: Server, queuePollingTime: number = 5000, ) {
        this._intervalId = null;
        this._pollingTime = queuePollingTime;
        this._sIoServer = sIoServer
    }

    /**
     * Starts the matchmaking engine, which keeps trying to arrange matches between
     * queued players, on a frequency defined by the queue polling time specified
     * at initialization.
     */
    public start(): void {
        if (this._intervalId !== null) {
            throw new Error("Engine is already running!");
        }

        this._intervalId = setTimeout(this.arrangeMatches, this._pollingTime);
    }

    /**
     * Tries to arrange matches between queued players.
     * If two players are suitable for a game, determined by an elo-based matchmaking criteria,
     * the match is created and the two players are notified.
     * @private
     */
    private async arrangeMatches(): Promise<void> {
        // Queued players, ordered by most recent
        // This way, the one that has been queuing for the longest time has the priority,
        // because, being the last in the queue, will be popped first
        const queuedPlayers: QueueEntry[] = await MatchmakingQueueModel
          .find({}).sort({ queuedSince: 1 });

        // Until there are at least 2 players in the queue,
        // keep trying to arrange matches
        while (queuedPlayers.length > 1) {
            const player: QueueEntry = queuedPlayers.pop();
            const opponent: QueueEntry = this.findOpponent(player, queuedPlayers);

            if (opponent !== null) {
                await this.arrangeMatch(player, opponent);
            }
        }
    }

    /**
     * Finds an opponent for the specified player and returns it.
     *
     * @param player player to find an opponent for
     * @param matchmakingQueue rest of the matchmaking queue (player excluded)
     * @private
     * @returns the opponent for the specified player, if found, else null
     */
    private findOpponent(player: QueueEntry, matchmakingQueue: QueueEntry[]): QueueEntry {
        const potentialOpponents: QueueEntry[] = this.getPotentialOpponents(player, matchmakingQueue);

        if (potentialOpponents.length === 0) {
            return null;
        }

        // Sort in descending order
        // (note that return 1 and -1 are inverted, because order is desc)
        potentialOpponents.sort((a: QueueEntry, b: QueueEntry) => {
            if (a.queuedSince < b.queuedSince) {
                return 1;
            }
            else if (a.queuedSince > b.queuedSince) {
                return -1;
            }
            else {
                return 0;
            }
        });

        // Popping the last element means getting and removing
        // the entry that has been in the queue for the longest time
        return potentialOpponents.pop();
    }

    /**
     * Returns a list of potential opponents for the provided player, by
     * applying an elo-based matchmaking criteria.
     *
     * @param player player to find the potential opponents for
     * @param matchmakingQueue all the other players in-queue
     * @private
     */
    private getPotentialOpponents(player: QueueEntry, matchmakingQueue: QueueEntry[]): QueueEntry[] {
        const potentialOpponents: QueueEntry[] = matchmakingQueue.filter((entry) => {
            return MatchmakingEngine.arePlayersMatchable(player, entry);
        });

        return potentialOpponents;
    }

    /**
     * Returns true if the specified players are similarly skilled.
     * In this case, skill is based on elo.
     *
     * @param p1
     * @param p2
     * @private
     */
    private static arePlayersMatchable(p1: QueueEntry, p2: QueueEntry): boolean {
        const p1EloDelta: number = MatchmakingEngine.getEloDelta(p1);
        const p2EloDelta: number = MatchmakingEngine.getEloDelta(p2);
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
    private static getEloDelta(player: QueueEntry): number {
        const startingDelta: number = 100;
        const timeBeforeIncreaseMs: number = 5000;

        // Delta's multiplier depends on time spent in queue
        // The more time he spent there, the more the delta is wide,
        // which means that a match should be found more easily
        const timeSpentInQueueMs: number = player.queuedSince.getMilliseconds();
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
        const createdMatch: match.MatchDocument = await match.createMatch(player1.userId, player2.userId);
        const notificationData: MatchFoundNotificationData = {
            matchId: createdMatch._id
        };

        const player1Notifier: MatchFoundEmitter = new MatchFoundEmitter(this._sIoServer, player1.userId);
        player1Notifier.emit(notificationData);

        const player2Notifier: MatchFoundEmitter = new MatchFoundEmitter(this._sIoServer, player2.userId);
        player2Notifier.emit(notificationData);
    }

    /**
     * Stops the engine from arranging matches
     */
    public stop(): void {
        if (this._intervalId === null) {
            throw new Error("Engine is already stopped!");
        }

        clearInterval(this._intervalId);

        this._intervalId = null;
    }
}
