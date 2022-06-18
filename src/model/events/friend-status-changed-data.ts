import { UserStatus } from '../database/user/user';

export interface FriendStatusChangedData {
    friendId: string;
    status: UserStatus;
}
