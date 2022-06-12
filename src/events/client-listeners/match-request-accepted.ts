import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';

import { MatchFoundEmitter } from '../emitters/match-found';
import { createMatch, MatchDocument } from '../../model/match/match';
import { MatchData } from '../../model/events/match-data';
import { ClientListenerNotifier } from './base/client-listener-notifier';
import { RequestAcceptedData } from '../../model/events/request-accepted-data';
import { getUserById, UserDocument, UserStatus } from '../../model/user/user';
import { RequestTypes } from '../../model/user/notification';

/**
 * Class that wraps socket.io functionality to listen
 * to a 'match-request-accepted' client event.
 * Such event happens when a user accepts a match request.
 * The match is then created between the two users, who are then notified.
 */
export class MatchRequestAcceptedListener extends ClientListenerNotifier<RequestAcceptedData> {
    /**
     * @param client that raised the event
     * @param ioServer server instance used to send notifications to the client
     */
    constructor(client: Socket, ioServer: Server) {
        super(ioServer, client, 'match-request-accepted');
    }

    public listen(): void {
        super.listen(async (eventData: RequestAcceptedData): Promise<void> => {
            // Check that both players can actually play the game
            // If not, do not create it and do not remove the notification
            if (!(await MatchRequestAcceptedListener.arePlayersAvailable(eventData))) {
                // TODO maybe create an event like 'accept-error' to
                //  notify the user that the request couldn't be accepted,
                //  and send a reason for its
                return;
            }

            // Remove notification only if the request can go through
            await MatchRequestAcceptedListener.removeNotification(eventData);

            // Arrange the match between the two players
            const match: MatchDocument = await MatchRequestAcceptedListener.arrangeMatch(eventData);

            // Notify the players
            await this.notifyPlayers(eventData, match._id);
        });
    }

    /**
     * Check if the two players involved in the match are actually available to play.
     * This is the case only if both are online and "idle", which means they are not
     * playing or spectating another game.
     * @param eventData
     * @private
     */
    private static async arePlayersAvailable(eventData: RequestAcceptedData): Promise<boolean> {
        const playerId: Types.ObjectId = Types.ObjectId(eventData.senderId);
        const player: UserDocument = await getUserById(playerId);

        const otherPlayerId: Types.ObjectId = Types.ObjectId(eventData.receiverId);
        const otherPlayer: UserDocument = await getUserById(otherPlayerId);

        const p1Available: boolean = player.status === UserStatus.Online;
        const p2Available: boolean = otherPlayer.status === UserStatus.Online;

        return p1Available && p2Available;
    }

    /**
     * Removes the match request notification from the user that received it
     * @param eventData
     * @private
     */
    private static async removeNotification(eventData: RequestAcceptedData): Promise<void> {
        const receiverId: Types.ObjectId = Types.ObjectId(eventData.receiverId);
        const receiver: UserDocument = await getUserById(receiverId);

        const senderId: Types.ObjectId = Types.ObjectId(eventData.senderId);
        await receiver.removeNotification(RequestTypes.MatchRequest, senderId);
    }

    private static async arrangeMatch(eventData: RequestAcceptedData): Promise<MatchDocument> {
        const p1Id: Types.ObjectId = Types.ObjectId(eventData.senderId);
        const p2Id: Types.ObjectId = Types.ObjectId(eventData.receiverId);

        return await createMatch(p1Id, p2Id);
    }

    /**
     * Generates a match found event that notifies the two players involved
     * @param eventData object containing the id of the players involved
     * @param matchId id of the match that has just been arranged
     * @private
     */
    private async notifyPlayers(
        eventData: RequestAcceptedData,
        matchId: Types.ObjectId
    ): Promise<void> {
        // Create two emitters, one for each player,
        // which will send the notification containing the match id to play in
        const p1Id: Types.ObjectId = Types.ObjectId(eventData.senderId);
        const p2Id: Types.ObjectId = Types.ObjectId(eventData.receiverId);

        const player1Emitter = new MatchFoundEmitter(this.ioServer, p1Id);
        const player2Emitter = new MatchFoundEmitter(this.ioServer, p2Id);
        const emitters: MatchFoundEmitter[] = [player1Emitter, player2Emitter];

        // Create the event data containing the match id
        const matchFoundData: MatchData = {
            matchId: matchId.toString(),
        };

        // Send match found notifications
        emitters.forEach((e: MatchFoundEmitter) => {
            e.emit(matchFoundData);
        });
    }
}
