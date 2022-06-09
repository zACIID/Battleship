export interface RequestAcceptedData {
    /**
     * Id of the user that sent the request
     */
    senderId: string;

    /**
     * Id of the user that received the request
     */
    receiverId: string;
}
