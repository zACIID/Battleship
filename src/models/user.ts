import * as mongoose from 'mongoose';
import { Model, Schema, SchemaTypes, Types } from 'mongoose';
import bcrypt from 'bcrypt';

import { NotificationSchema, RequestNotification, RequestTypes } from './notification';
import { UserStats } from './user-stats';
import { Relationship, RelationshipSchema } from './relationship';
import { StatsSchema } from './user-stats';

/**
 * Enumeration that defines all the possible roles that can be
 * assigned to some user.
 */
export enum UserRoles {
    Base = 'Base',
    Moderator = 'Moderator',
    Admin = 'Admin',
}

/**
 * Interface that represents a User of the system.
 */
export interface User {
    username: string;
    mail: string;
    relationships: [Relationship];
    stats: UserStats;
    roles: string[];
    salt: string;
    pwd_hash: string;
    notifications: RequestNotification[];
}

/**
 * Interface that represents a User document, which is the
 * internal representation of a Chat object in the database.
 * It exposes some useful methods to interact with the database object.
 */
export interface UserDocument extends User, Document {
    /**
     * Adds the provided user id to this instance's friends list.
     * If a user id is already in the friends list, it is not added.
     *
     * @param friend_id collection of user ids to add to the friends list
     * @param auto_call flag, if true the function will call itself for the other object instance
     */
    addFriend(friend_id: Types.ObjectId, auto_call?: boolean): Promise<UserDocument>;

    /**
     * Removes the provided user ids from this instance's friends list.
     * If a user id is already in the friends list, nothing happens.
     *
     * @param friend_ids collection of user ids to remove from the friends list
     */
    removeFriends(friend_ids: [Types.ObjectId]): Promise<UserDocument>;

    /**
     * Removes the provided user id from this instance's friends list.
     * If a user id is already in the friends list, nothing happens.
     *
     * @param friend_id collection of user ids to remove from the friends list
     * @param auto_call flag, if true the function will call itself for the other object instance
     */
    removeFriend(friend_id: Types.ObjectId, auto_call?: boolean): Promise<UserDocument>;

    /**
     * Adds the provided role to this instance.
     * If the user already has the role, it is not added a second time.
     *
     * @param role role to be set
     */
    addRole(role: UserRoles): Promise<UserDocument>;

    /**
     * Removes the provided role from this instance.
     * If the user doesn't have the role, nothing happens.
     *
     * @param role role to be removed
     */
    removeRole(role: UserRoles): Promise<UserDocument>;

    /**
     * Returns true if the user has the provided role, false otherwise.
     *
     * @param role role to check
     */
    hasRole(role: UserRoles): boolean;

    /**
     * Returns true if the user is a moderator, false otherwise.
     */
    isModerator(): boolean;

    /**
     * Returns true if the user is an admin, false otherwise.
     */
    isAdmin(): boolean;

    /**
     * Returns true if the user is friend with key owner, false otherwise.
     *
     * @param key friend's key to look for
     */
    isFriend(key: Types.ObjectId): boolean;

    // TODO add docs for these methods
    setPassword(pwd: string): Promise<UserDocument>;

    validatePassword(pwd: string): Promise<boolean>;

    addNotification(type: RequestTypes, requester: Types.ObjectId): Promise<UserDocument>;

    removeNotification(type: RequestTypes, requester: Types.ObjectId): Promise<UserDocument>;

    addChat(_id: Types.ObjectId): Promise<UserDocument>;

    removeChat(_id: Types.ObjectId): Promise<UserDocument>;
}

export const UserSchema = new Schema<UserDocument>({
    username: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
        index: true,
    },

    mail: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/,
    },

    relationships: {
        type: [RelationshipSchema],
        default: [],
    },

    stats: StatsSchema,

    roles: {
        type: [SchemaTypes.String],
        required: true,
        enum: [UserRoles.Base.valueOf(), UserRoles.Moderator.valueOf(), UserRoles.Admin.valueOf()],
        default: UserRoles.Base.valueOf(),
    },

    salt: {
        type: SchemaTypes.String,
        required: false,
    },

    pwd_hash: {
        type: SchemaTypes.String,
        required: false,
    },

    notifications: {
        type: [NotificationSchema],
        default: [],
    },

    online: SchemaTypes.Boolean,
});

UserSchema.methods.addNotification = async function (
    typeRequest: RequestTypes,
    requester: Types.ObjectId
): Promise<UserDocument> {
    if (this.notifications.includes({ type: typeRequest, sender: requester }))
        await Promise.reject(new Error('Notification already sent'));

    this.notifications.push({ type: typeRequest, sender: requester });

    return this.save();
};

UserSchema.methods.removeNotification = async function (
    typeRequest: RequestTypes,
    requester: Types.ObjectId
): Promise<UserDocument> {
    for (const idx in this.notifications) {
        if (
            this.notifications[idx].type === typeRequest &&
            this.notifications[idx].sender === requester
        )
            this.notifications.splice(parseInt(idx), 1);
    }
    return this.save();
};



// TODO implement all of below considering the change done to UserSchema:
//  relationships replaces friends and chats
UserSchema.methods.addChat = async function (id: Types.ObjectId): Promise<UserDocument> {
    const data = isPresent.apply(this, id)
    if (data.found) {
        await Promise.reject(new Error('User already part of this chat'));
    }
    this.relationships.push()
    this.chats.push(id);

    return this.save();
};

UserSchema.methods.removeChat = async function (id: Types.ObjectId): Promise<UserDocument> {
    for (const idx in this.chats) {
        if (this.chats[idx] === id) this.chats.splice(parseInt(idx), 1);
    }
    return this.save();
};

UserSchema.methods.setPassword = async function (pwd: string): Promise<UserDocument> {
    const salt = await bcrypt
        .genSalt(10)
        .catch((error) =>
            Promise.reject(new Error('Error with salt generation: ' + error.message))
        );

    this.pwd_hash = await bcrypt
        .hash(pwd, salt)
        .catch((error) =>
            Promise.reject(new Error('Error with password encryption: ' + error.message))
        );

    return this.save();
};

UserSchema.methods.validatePassword = async function (pwd: string): Promise<boolean> {
    const hashedPw = await bcrypt
        .hash(pwd, this.salt)
        .catch((error) =>
            Promise.reject(new Error('Error with password encryption: ' + error.message))
        );

    return this.pwd_hash === hashedPw;
};

UserSchema.methods.addFriend = async function (
    friend_id: Types.ObjectId,
    auto_call?: boolean
): Promise<UserDocument> {
    if (!this.isFriend(friend_id)) {
        this.friends.push(friend_id);
        if (auto_call === undefined || auto_call) {
            const user: UserDocument = await getUserById(friend_id).catch((err: Error) =>
                Promise.reject(new Error(err.message))
            );
            await user
                .addFriend(this._id, false)
                .catch((err: Error) => Promise.reject(new Error(err.message)));
        }
        return this.save();
    } else return Promise.reject(new Error('this id is already in the array: ' + friend_id));
};

UserSchema.methods.removeRole = async function (role: UserRoles): Promise<UserDocument> {
    for (const idx in this.roles) {
        if (this.roles[idx] === role.valueOf()) this.roles.splice(parseInt(idx), 1);
    }
    return this.save();
};

UserSchema.methods.removeFriend = async function (
    friend_id: Types.ObjectId,
    auto_call?: boolean
): Promise<UserDocument> {
    for (let idx in this.relationships) {
        if (this.friends[idx] === friend_id) {
            this.friends.splice(parseInt(idx), 1);

            if (auto_call === undefined || auto_call) {
                const user: UserDocument = await getUserById(friend_id).catch((err: Error) =>
                    Promise.reject(new Error(err.message))
                );

                await user
                    .removeFriend(this._id, false)
                    .catch((err: Error) => Promise.reject(new Error(err.message)));
            }

            return this.save();
        }
    }
    return Promise.reject(new Error("There's no id equal to that" + friend_id));
};

UserSchema.methods.removeFriends = async function (friend_ids: [Types.ObjectId]): Promise<void> {
    let id: Types.ObjectId;
    const failures: string[] = new Array<string>();
    for (id of friend_ids) {
        await this.removeFriend(id).catch((err: Error) => failures.push(err.message));
    }
    return failures.length === 0
        ? Promise.resolve()
        : Promise.reject(new Error('Errors occurred: ' + failures));
};

UserSchema.methods.setRole = async function (role: UserRoles): Promise<UserDocument> {
    this.roles.push(role.valueOf());
    return this.save();
};

UserSchema.methods.isModerator = function (): boolean {
    return this.hasRole(UserRoles.Moderator);
};

UserSchema.methods.isAdmin = function (): boolean {
    return this.hasRole(UserRoles.Admin);
};

UserSchema.methods.hasRole = function (role: UserRoles): boolean {
    let value = false;
    this.roles.forEach((element: string) => {
        if (element === role.valueOf()) value = true;
    });

    return value;
};

UserSchema.methods.isFriend = function (key: Types.ObjectId): boolean {
    let value = false;
    this.friends.forEach((element: Types.ObjectId) => {
        if (element === key) value = true;
    });

    return value;
};

UserSchema.methods.isPresent

export const UserModel: Model<UserDocument> = mongoose.model('User', UserSchema, 'users');

export async function getUserById(_id: Types.ObjectId): Promise<UserDocument> {

    const userdata: UserDocument = await UserModel.findOne({_id}).catch((err: Error) =>
        Promise.reject(new Error('Internal server error'))

    );

    return (!userdata)? Promise.reject(new Error('No user with that id')) 
    : Promise.resolve(userdata)
}

export async function getUserByUsername(username: string): Promise<UserDocument> {
    const userdata: UserDocument = await UserModel.findOne({username}).catch((err: Error) =>
        Promise.reject(new Error('Internal server error'))
    );

    return (!userdata)? Promise.reject(new Error('No user with that id')) 
    : Promise.resolve(userdata)
}

export async function createUser(data): Promise<UserDocument> {
    getUserByUsername(data.username).catch((err) => {
        const user = new UserModel(data);
        return user.save();
    });

    return Promise.reject(new Error('User already exists'));
}

function isPresent( _id: Types.ObjectId ) : {found: boolean, idx: number} {
    for (var index in this.relationships) {
        if (this.relationships[index].friendId === _id || this.relationships[index].chatId === _id) 
            return {found: true, idx: parseInt(index)}
    }
    return {found: false, idx: -1}
}

export async function getLeaderboard() : Promise<UserDocument[]> {
    return UserModel.find({}, { _id: 1, username: 1, elo: 1})
    .sort({elo: -1}).limit(20).catch((err: Error) => 
        Promise.reject(new Error("Sum internal error just occured"))
    )
}

export async function deleteUser( _id: Types.ObjectId ) Promise<void> {
    return 
}



