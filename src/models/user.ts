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
     * Adds the provided collection of user ids to this instance's friends list.
     * If a user id is already in the friends list, it is not added. TODO or an exception is thrown?
     *
     * @param friend_ids collection of user ids to add to the friends list
     */
    addFriends(friend_ids: [Types.ObjectId]): void;
    
    /**
     * Removes the provided user ids from this instance's friends list.
     * If a user id is already in the friends list, nothing happens. TODO or an exception is thrown?
     *
     * @param friend_ids collection of user ids to remove from the friends list
     */
     removeFriends(friend_ids: [Types.ObjectId]): void;

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

UserSchema.methods.addFriends = function( friend_ids: [Types.ObjectId] ) : void {
    for (const id of friend_ids) {
        if (id !== this._id)
            this.friends.push(id)
    }
}

UserSchema.methods.removeRole = function( role: UserRoles ) : void {
    this.roles.forEach(function(part, index) {
        if (this[index] === role.valueOf())  this.splice(index, 1) 
    }, this.roles)
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

UserSchema.methods.hasRole = function(role: UserRoles) : boolean {
    let value: boolean = false;
    this.roles.forEach(element => {
        if (element === role.valueOf()) {
            value = true;
        }
    });

    return value;
}



export const User: Model<IUser> = mongoose.model("User", UserSchema, "users")

