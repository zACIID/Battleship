import { UserStatuses } from '../user/user';

export interface FriendStatusChangedData {
    friendId: string;
    status: UserStatuses;
}
