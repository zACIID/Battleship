import { Socket } from "socket.io";
import { ClientListener } from "./base/client-listener";

interface ChatJoinData {
    chatId: string;
}

/**
 * Class that wraps Socket.io functionality to listen
 * to a 'chat-joined' client event.
 * Such event allows the client to join and leave a Socket.io room for some
 * specific chat, so that he can listen only to messages of such chat.
 */
export class ChatJoinedListener extends ClientListener {
    constructor(client: Socket) {
        super(client, "chat-joined");
    }

    listen() {
        super.listen((joinData: ChatJoinData) => {
            this.client.join(joinData.chatId);

            this.client.on('chat-left', (joinData: ChatJoinData) => {
                this.client.leave(joinData.chatId);
            })
        });
    }
}
