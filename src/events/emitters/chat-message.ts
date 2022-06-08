import { Types } from 'mongoose';
import { Server } from 'socket.io';

import { RoomEmitter } from './base/room-emitter';
import { ChatMessage } from '../../model/events/chat-message';

/**
 * Class that wraps socket.io functionality to generate a "chat-message" event
 * for a specific chat.
 * All the users currently on the chat should be listening for this event,
 * in order to retrieve any new messages sent.
 */
export class ChatMessageEmitter extends RoomEmitter<ChatMessage> {
    /**
     * @param ioServer Socket.io server instance
     * @param chatId id of the chat whose users have to be notified
     */
    public constructor(ioServer: Server, chatId: Types.ObjectId) {
        const eventName: string = `chat-message`;

        super(ioServer, eventName, chatId.toString());
    }
}
