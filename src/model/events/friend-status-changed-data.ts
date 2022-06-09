import { UserStatus } from '../user/user';

export interface FriendStatusChangedData {
    friendId: string;
    status: UserStatus;
}
