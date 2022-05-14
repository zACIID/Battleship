import * as mongoose from "mongoose";
import {Document, Model, Schema, SchemaTypes, Types} from "mongoose";
import {IChat, ChatSchema} from "./chat";

/**
 * Interface that represent a stats sub-document found in a User document.
 *
 * This does not extend Document because it represents a sub-document,
 * so it does not need Document methods/fields like _id, __v, save(), etc.
 */
 export interface IStats {
    elo: number;
    wins: number;
    losses: number;
    ships_destroyed: number;
    total_shots: number;
    hits: number;
}

export const StatsSchema = new Schema<IStats>({
    elo: {
        type: SchemaTypes.Number,
        default: 0,
        index: true
    }, 
    wins: {
        type: SchemaTypes.Number,
        default: 0
    }, 
    losses: {
        type: SchemaTypes.Number,
        default: 0
    }, 
    ships_destroyed: { 
        type: SchemaTypes.Number,
        default: 0
    }, 
    total_shots: {
        type: SchemaTypes.Number,
        default: 0
    },
    hits: {
       type: SchemaTypes.Number,
       default: 0
    }
})

/**
 * Enumeration that defines all the possible roles that can be
 * assigned to some user.
 */
 export enum UserRoles {
    Base = "base",
    Moderator = "moderator",
    Admin = "admin"
}

/**
 * Interface that represents a User document.
 * Such document represents a user of the system.
 */
export interface IUser extends Document {
    username: string;
    mail: string;
    friends: [Types.ObjectId];
    chats: [IChat];
    stats: IStats;
    roles: [string];
    salt: string;
    pwd_hash: string;
    
    /**
     * Adds the provided user id to this instance's friends list.
     * If a user id is already in the friends list, it is not added. TODO or an exception is thrown?
     *
     * @param friend_id collection of user ids to add to the friends list
     */
     addFriend(friend_id: Types.ObjectId): Promise<void>;
    
    /**
     * Removes the provided user ids from this instance's friends list.
     * If a user id is already in the friends list, nothing happens. TODO or an exception is thrown?
     *
     * @param friend_ids collection of user ids to remove from the friends list
     */
     removeFriends(friend_ids: [Types.ObjectId]): Promise<void>;

     /**
     * Removes the provided user id from this instance's friends list.
     * If a user id is already in the friends list, nothing happens. TODO or an exception is thrown?
     *
     * @param friend_id collection of user ids to remove from the friends list
     */
      removeFriend(friend_id: Types.ObjectId): Promise<void>;

     /**
      * Adds the provided role to this instance.
      * If the user already has the role, it is not added a second time. TODO or an exception is thrown?
      *
      * @param role role to be set
      */
     setRole(role: UserRoles): void;
 
     /**
      * Removes the provided role from this instance.
      * If the user doesn't have the role, nothing happens. TODO or an exception is thrown?
      *
      * @param role role to be removed
      */
     removeRole(role: UserRoles): void;
 
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
    isFriend(key: Types.ObjectId) : boolean;
}

export const UserSchema = new Schema<IUser>({
    username: {
        type: SchemaTypes.String,
        required: true, 
        unique: true, 
        index: true
    },

    mail: {
        type: SchemaTypes.String,
        required: true,
        unique: true, 
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/
    },

    friends: {
        type: [SchemaTypes.ObjectId]
    }, 

    chats: {
        type: [SchemaTypes.ObjectId],
        default: []
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
        required: false 
    },

    pwd_hash: {
        type: SchemaTypes.String,
        required: false 
    }
})

/*
details.updateOne(
    { name: "John" },
    { $addToSet: { locations: ["New York", "Texas", "Detroit"] } }
 */

/*
Favorite.updateOne({
  name
}, {
  $pullAll: {
    favorites: req.params.deleteUid,
  },
})
*/

UserSchema.methods.addFriend = async function( friend_id: Types.ObjectId ) : Promise<void> {
    if (!this.isFriend(friend_id)) {
        this.friends.push(friend_id)
        User.updateOne({ _id: friend_id }, { $addToSet: { friends: [this._id] }})
    }
}

UserSchema.methods.removeRole = function( role: UserRoles ) : void {
    this.roles.forEach(function(part, index) {
        if (part === role.valueOf())  this.splice(index, 1) 
    }, this.roles)
}

UserSchema.methods.removeFriend = async function( friend_id: Types.ObjectId ) : Promise<void> {
    this.friends.forEach(function(part, index) {
        if (part === friend_id) {
            this.friends.splice(index, 1) 
            User.updateOne({ _id: friend_id }, { $pullAll: { friends: this._id }})
        }
    }, this)
}

UserSchema.methods.removeFriends = async function( friend_ids: [Types.ObjectId] ) : Promise<void> {
    friend_ids.forEach(function(friend_id) {
        this.removeFriend(friend_id)
    }, this)
}   

UserSchema.methods.setRole = function( role: UserRoles ) : void {
    this.roles.push(role.valueOf())
}

UserSchema.methods.isModerator = function() : boolean {
    return this.hasRole(UserRoles.Moderator)
}

UserSchema.methods.isAdmin = function() : boolean {
    return this.hasRole(UserRoles.Admin)
}

UserSchema.methods.hasRole = function( role: UserRoles ) : boolean {
    let value: boolean = false
    this.roles.forEach(element => {
        if (element === role.valueOf()) value = true;
    });

    return value;
}

UserSchema.methods.isFriend = function( key: Types.ObjectId ) : boolean {
    let value : boolean = false
    this.roles.forEach( (element: string) => {
        // element and key should be both string because element parameter must be string (in order the foreach to work)
        if (element === key.toString()) value = true;
    });

    return value;

}

export const User: Model<IUser> = mongoose.model("User", UserSchema, "users")

