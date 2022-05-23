import { Document, Schema, SchemaTypes, Types } from 'mongoose';

/**
 * Enumeration that defines all the possible notification types receivable by a user
 */
export enum RequestTypes {
    FriendRequest = 'FriendRequest',
    MatchRequest = 'MatchRequest',
}

/**
 * Interface that represents a User notification
 */
export interface RequestNotification {
    type: RequestTypes;
    sender: Types.ObjectId;
}

/**
 * Interface that represents a notification sub-document
 */
export interface RequestNotificationDocument extends RequestNotification, Document {

}

/**
 * A notification is identified by the pair (type, requester)
 */
export const NotificationSchema = new Schema<RequestNotification>({
    type: {
        type: [SchemaTypes.String],
        required: true,
        enum: [RequestTypes.FriendRequest.valueOf(), RequestTypes.MatchRequest.valueOf()],
    },
    sender: {
        type: Types.ObjectId,
        required: true
    },
});
