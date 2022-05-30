import { Message } from './message';

export interface ApiChat {
    /**
     * Id of the chat
     */
    chatId: string;

    /**
     * Ids of the users involved in the chat
     */
    users: string[];

    /**
     * Messages exchanged in the chat
     */
    messages: Message[]
}
