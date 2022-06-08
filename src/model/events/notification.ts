export interface Notification {
    /**
     * Id of the user that generated the notification
     */
    sender: string;

    /**
     * Type of the notification
     */
    type: string;
}
