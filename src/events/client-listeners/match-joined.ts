import { Socket } from 'socket.io';
import { Types } from 'mongoose';
import chalk from 'chalk';

import { ClientListener } from './base/client-listener';
import { JoinReason, MatchJoinedData } from '../../model/events/match-joined-data';
import { setUserStatus, UserStatus } from '../../model/user/user';
import { ioServer } from '../../index';

/**
 * Class that wraps socket.io functionality to listen
 * to a 'match-joined' client event.
 * Such event allows the client to join a socket.io room for some
 * specific match, so that he can listen only to events of such match.
 * Also, depending on the reason why the client joined the match,
 * the status of the corresponding user is changed.
 */
export class MatchJoinedListener extends ClientListener<MatchJoinedData> {
    constructor(client: Socket) {
        super(client, 'match-joined');
    }

    public listen(): void {
        super.listen(async (joinData: MatchJoinedData): Promise<void> => {
            this.client.join(joinData.matchId);

            console.log(
                chalk.bgGreen(`Client ${this.client.id} joined the match '${joinData.matchId}'!`)
            );

            // Change the status of the user based on the joining reason
            const joinReason: JoinReason = joinData.joinReason;
            let newStatus: UserStatus;
            if (joinReason === JoinReason.Player) {
                newStatus = UserStatus.PrepPhase;
            } else if (joinReason === JoinReason.Spectator) {
                newStatus = UserStatus.Spectating;
            } else {
                throw new Error(`Unhandled case of join reason. Value: ${joinReason}`);
            }

            await setUserStatus(ioServer, Types.ObjectId(joinData.userId), newStatus);
        });
    }
}
