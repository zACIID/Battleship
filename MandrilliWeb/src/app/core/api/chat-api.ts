/**
 * Interface that represents a Chat resource sent by the api
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
    messages: ApiMessage[]
}

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

