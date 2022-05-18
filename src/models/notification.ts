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
    requestType: NotificationTypes;
    requester: Types.ObjectId;
}

/**
 * A notification is strictly identified by the pair (type, requester)
 */
export const NotificationSchema = new Schema<Notification>({
    typeRequest: {
        type: [SchemaTypes.String],
        required: true,
        enum: [NotificationTypes.FriendRequest.valueOf(), NotificationTypes.MatchRequest.valueOf()],
    },
    requester: {
        type: Types.ObjectId,
        required: true,
    },
});
