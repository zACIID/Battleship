export interface Message {
    /**
     * Id of the user that sent this message
     */
    author: string;

    /**
     * Content of the message
     */
    content: string;

    /**
     * Time that the message was sent at
     */
    timestamp: Date;
}
