export enum NotificationType {
    FriendRequest = 'FriendRequest',
    MatchRequest = 'MatchRequest',
}

export interface Notification {
    /**
     * type of the notification
     */
    type: NotificationType;

    /**
     * Id of the user that generated the notification
     */
    sender: string;
}
