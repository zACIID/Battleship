import { getUserData, InsertedUser } from './users';
import { insertUser } from './users';
import { User, UserRoles } from '../../../../src/model/user/user';

export const insertModerator: () => Promise<InsertedUser> = async () => {
    const modData: User = getUserData();
    modData.roles.push(UserRoles.Moderator);

    return await insertUser(modData);
};
