export interface Notification {
    /**
     * type of the notification
     */
    type: string;

    /**
     * Id of the user that generated the notification
     */
    sender: string;
}
