import { Types } from 'mongoose';
import { Server } from 'socket.io';
import chalk from 'chalk';

import { RoomEmitter } from './base/room-emitter';
import { MatchData } from '../../model/events/match-data';
import { setUserStatus, UserStatus } from '../../model/database/user/user';

/**
 * Class that wraps socket.io functionality to generate a "match-found" event
 * for a specific player.
 * Such event should be listened to by a player that is looking to join a match,
 * either because he queued for a casual one or because he sent some match requests.
 */
export class MatchFoundEmitter extends RoomEmitter<MatchData> {
    private readonly playerId: Types.ObjectId;

    /**
     * @param ioServer socket.io server instance
     * @param playerId id of the user that has to be notified
     */
    public constructor(ioServer: Server, playerId: Types.ObjectId) {
        const eventName: string = 'match-found';
        super(ioServer, eventName, playerId.toString());

        this.playerId = playerId;
    }

    public emit(data: MatchData) {
        setUserStatus(this.ioServer, this.playerId, UserStatus.PrepPhase)
            .then(() => {
                super.emit(data);
            })
            .catch((err: Error) => {
                console.log(
                    chalk.bgRed(
                        `[${MatchFoundEmitter.name}] Error while setting user status to ${UserStatus.PrepPhase}.` +
                            `Reason: ${err.message}`
                    )
                );
            });
    }
}
