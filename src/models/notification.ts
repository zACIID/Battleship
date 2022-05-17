import {Schema, SchemaTypes, Types} from 'mongoose';

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
    requestType: RequestTypes;
    requester: Types.ObjectId;
}

/**
 * A notification is strictly identified by the pair (type, requester)
 */
export const NotificationSchema = new Schema<RequestNotification>({
    typeRequest: {
        type: [SchemaTypes.String],
        required: true,
        enum: [RequestTypes.FriendRequest.valueOf(), RequestTypes.MatchRequest.valueOf()],
    },
    requester: {
        type: Types.ObjectId,
        required: true,
    },
});
