export interface ChatMessage {
    /**
     * Id of the user that sent the message
     */
    author: string;

    /**
     * Timestamp in unix seconds
     */
    timestamp: number;

    /**
     * Content of the message
     */
    content: string;
}
