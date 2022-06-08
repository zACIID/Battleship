/**
 * Interface representing the data coming from a
 * "friend-request-accepted" event
 */
export interface AcceptedFriendRequest {
    userToNotify: string;
    friendId: string;
}
