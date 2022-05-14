import * as mongoose from 'mongoose';
import {Document, Model, Schema, SchemaTypes, Types} from 'mongoose';
import {ChatDocument, ChatSchema} from './chat';
import bcrypt from 'bcrypt';

/**
 * Interface that represent a stats sub-document found in a User document.
 *
 * This does not extend Document because it represents a sub-document,
 * so it does not need Document methods/fields like _id, __v, save(), etc.
 */
export interface UserStats {
  top_elo: number;
  elo: number;
  wins: number;
  losses: number;
  ships_destroyed: number;
  total_shots: number;
  hits: number;
}

export const StatsSchema = new Schema<UserStats>({
  top_elo: {
    type: SchemaTypes.Number,
    default: 0,
  },
  elo: {
    type: SchemaTypes.Number,
    default: 0,
    index: true,
  },
  wins: {
    type: SchemaTypes.Number,
    default: 0,
  },
  losses: {
    type: SchemaTypes.Number,
    default: 0,
  },
  ships_destroyed: {
    type: SchemaTypes.Number,
    default: 0,
  },
  total_shots: {
    type: SchemaTypes.Number,
    default: 0,
  },
  hits: {
    type: SchemaTypes.Number,
    default: 0,
  },
});

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

/**
 * Interface that represents a User document.
 * Such document represents a user of the system.
 */
export interface UserDocument {
  username: string;
  mail: string;
  friends: Types.ObjectId[];
  chats: Types.ObjectId[];
  stats: UserStats;
  roles: string[];
  salt: string;
  pwd_hash: string;
  notifications: RequestNotification[];

  /**
   * Adds the provided user id to this instance's friends list.
   * If a user id is already in the friends list, it is not added. TODO or an exception is thrown?
   *
   * @param friend_id collection of user ids to add to the friends list
   * @param auto_call flag, if true the function will call itself for the other object instance
   */
  addFriend(friend_id: Types.ObjectId, auto_call?: boolean): Promise<UserDocument>;

  /**
   * Removes the provided user ids from this instance's friends list.
   * If a user id is already in the friends list, nothing happens. TODO or an exception is thrown?
   *
   * @param friend_ids collection of user ids to remove from the friends list
   */
  removeFriends(friend_ids: [Types.ObjectId]): Promise<UserDocument>;

  /**
   * Removes the provided user id from this instance's friends list.
   * If a user id is already in the friends list, nothing happens. TODO or an exception is thrown?
   *
   * @param friend_id collection of user ids to remove from the friends list
   * @param auto_call flag, if true the function will call itself for the other object instance
   */
  removeFriend(friend_id: Types.ObjectId, auto_call?: boolean): Promise<UserDocument>;

  /**
   * Adds the provided role to this instance.
   * If the user already has the role, it is not added a second time. TODO or an exception is thrown?
   *
   * @param role role to be set
   */
  setRole(role: UserRoles): Promise<UserDocument>;

  /**
   * Removes the provided role from this instance.
   * If the user doesn't have the role, nothing happens. TODO or an exception is thrown?
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

  friends: {
    type: [SchemaTypes.ObjectId],
    default: [],
  },

  chats: {
    type: [SchemaTypes.ObjectId],
    default: [],
  },

  stats: StatsSchema,

    roles: {
        type: [SchemaTypes.String],
        required: true,
        enum: [
            UserRoles.Base.valueOf(),
            UserRoles.Moderator.valueOf(),
            UserRoles.Admin.valueOf()
        ],
        default: UserRoles.Base.valueOf()
    },

  salt: {
    type: SchemaTypes.String,
    required: false,
  },

  pwd_hash: {
    type: SchemaTypes.String,
    required: false,
  },

  notifications: [
    {
      typeRequest: {
        type: [SchemaTypes.String],
        required: true,
        enum: [RequestTypes.FriendRequest.valueOf(), RequestTypes.MatchRequest.valueOf()],
      },
      requester: {
        type: Types.ObjectId,
        required: true,
      },
    },
  ],

  online: SchemaTypes.Boolean,
});

UserSchema.methods.addNotification = async function (
  typeRequest: RequestTypes,
  requester: Types.ObjectId
): Promise<UserDocument> {
  if (this.notifications.includes({requestType: typeRequest, requester}))
    await Promise.reject(new Error('Notification already sent'));

  this.notifications.push({requestType: typeRequest, requester});

  return this.save();
};

UserSchema.methods.removeNotification = async function (
  typeRequest: RequestTypes,
  requester: Types.ObjectId
): Promise<UserDocument> {
  for (const idx in this.notifications) {
    if (
      this.notifications[idx].requestType === typeRequest &&
      this.notifications[idx].requester === requester
    )
      this.notifications.splice(parseInt(idx), 1);
  }
  return this.save();
};

/* TODO WARNING: chat must be already created, chats field just contains it's ObjectId */
UserSchema.methods.addChat = async function (id: Types.ObjectId): Promise<UserDocument> {
  if (this.chats.includes(id)) {
    await Promise.reject(new Error('User already part of this chat'));
  }
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
  const salt = await bcrypt.genSalt(10).catch((error) =>
    Promise.reject(new Error('Error with salt generation: ' + error.message))
  );

  this.pwd_hash = await bcrypt.hash(pwd, salt).catch((error) =>
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
  // TODO così non si scorrono gli indici, ma gli element degli array.
  //  quello che si voleva fare era for (i=0; i<this.friend.length; i++) ??
  //  se è così, cambiare anche nel resto del codice
  for (let idx in this.friends) {
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

export async function getUserById(_id: Types.ObjectId): Promise<UserDocument> {
  return await UserModel.findOne({_id}).catch((err: Error) =>
    Promise.reject(new Error('No user with that id'))
  );
}

export async function getUserByUsername(username: string): Promise<UserDocument> {
  return await UserModel.findOne({username}).catch((err: Error) =>
    Promise.reject(new Error('No user with that username'))
  );
}

export const UserModel: Model<UserDocument> = mongoose.model('User', UserSchema, 'users');
