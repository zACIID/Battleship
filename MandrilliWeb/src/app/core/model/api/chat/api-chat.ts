import { Chat } from '../../chat/chat';
import { ApiMessage, toMessage } from './api-message';

/**
 * Interface that mimics what the api responds with after
 * a request on a chat endpoint
 */
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
    messages: ApiMessage[];
}

export const toChat = (apiChat: ApiChat): Chat => {
    return {
        chatId: apiChat.chatId,
        users: apiChat.users,
        messages: apiChat.messages.map((apiMessage: ApiMessage) => {
            return toMessage(apiMessage);
        }),
    };
};
