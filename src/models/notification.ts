import { Schema, SchemaTypes, Types } from 'mongoose';

/**
 * Enumeration that defines all the possible notification types receivable by a user
 */
export enum NotificationTypes {
    FriendRequest = 'FriendRequest',
    MatchRequest = 'MatchRequest',
}

/**
 * Interface that represents a User notification
 */
export interface Notification {
    type: NotificationTypes;
    sender: Types.ObjectId;
}

/**
 * A notification is strictly identified by the pair (type, requester)
 */
export const NotificationSchema = new Schema<Notification>({
    type: {
        type: [SchemaTypes.String],
        required: true,
        enum: [NotificationTypes.FriendRequest.valueOf(), NotificationTypes.MatchRequest.valueOf()],
    },
    sender: {
        type: Types.ObjectId,
        required: true,
    },
});
