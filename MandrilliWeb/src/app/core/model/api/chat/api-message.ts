import { Message } from '../../chat/message';
import { fromUnixSeconds, toUnixSeconds } from '../../../api/utils/date';

/**
 * Interface that represents a Message resource sent by the api
 */
export interface ApiMessage {
    /**
     * Id of the user that sent this message
     */
    author: string;

    /**
     * Time (in Unix seconds) that the message was sent at
     */
    timestamp: number;

    /**
     * Content of the message
     */
    content: string;
}

export const toMessage = (apiMessage: ApiMessage): Message => {
    return {
        author: apiMessage.author,
        timestamp: fromUnixSeconds(apiMessage.timestamp),
        content: apiMessage.content,
    };
};

export const toApiMessage = (message: Message): ApiMessage => {
    return {
        author: message.author,
        timestamp: toUnixSeconds(message.timestamp),
        content: message.content,
    };
};
