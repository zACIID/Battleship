import { AnyKeys, Types } from 'mongoose';
import bcrypt from 'bcrypt';

import {
    createUser,
    UserDocument,
    UserModel,
    UserRoles,
    UserStatus,
} from '../../src/model/database/user/user';
import { getRandomInt } from './utils/math';

const knownPassword: string = 'test';

export const getBaseUserData = async (): Promise<AnyKeys<UserDocument>> => {
    const salt: string = await bcrypt.genSalt(10);
    const pwdHash: string = await bcrypt.hash(knownPassword, salt);

    return {
        username: `username-${getRandomInt(0, 10000)}-${Date.now()}`,
        pwd_hash: pwdHash,
        salt: salt,
        roles: [UserRoles.Base],
        status: UserStatus.Online,
        stats: {
            elo: getRandomInt(0, 1000),
            topElo: getRandomInt(2000, 3000),
            wins: getRandomInt(0, 50),
            losses: getRandomInt(0, 50),
            shipsDestroyed: getRandomInt(50, 500),
            totalShots: getRandomInt(250, 2500),
            totalHits: getRandomInt(100, 1500),
        },
        relationships: [],
        notifications: [],
    };
};

export const insertMultipleUsers = async (nUsers: number): Promise<UserDocument[]> => {
    const insertedUsers: UserDocument[] = [];
    for (let i = 0; i < nUsers; i++) {
        const userData: AnyKeys<UserDocument> = await getBaseUserData();
        const user: UserDocument = await createUser(userData);
        insertedUsers.push(user);
    }

    return insertedUsers;
};

export const deleteMultipleUsers = async (userIds: Types.ObjectId[]) => {
    await UserModel.deleteMany({ _id: { $in: userIds } });
};
