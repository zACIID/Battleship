import { error } from "console";
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
     * @param auto_call flag, if true the function will call itself for the other object instance 
     */
     addFriend(friend_id: Types.ObjectId, auto_call: boolean): Promise<void>;
    
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
     * @param auto_call flag, if true the function will call itself for the other object instance 
     */
      removeFriend(friend_id: Types.ObjectId, auto_call: boolean): Promise<void>;

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
        type: [SchemaTypes.ObjectId],
        default: []
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

UserSchema.methods.addFriend = async function( friend_id: Types.ObjectId, auto_call: boolean = true) : Promise<void> {
    if (!this.isFriend(friend_id)) {
        this.friend.push(friend_id)
        if (auto_call) {
            var user: IUser = await getUserById(friend_id).catch((err: Error) => Promise.reject(new Error(err.message)))
            await user.addFriend(this._id, false).catch((err: Error) => Promise.reject(new Error(err.message)))
        }
        return this.save()
    }
    else return Promise.reject(new Error("this id is already in the array: " + friend_id))
}

UserSchema.methods.removeRole = function( role: UserRoles ) : void {
    this.roles.forEach(function(part: string, index: number) {
        if (part === role.valueOf())  this.splice(index, 1) 
    }, this.roles)
}

UserSchema.methods.removeFriend = async function( friend_id: Types.ObjectId, auto_call: boolean = true ) : Promise<void> {
    for (var index in this.friends){
        if (this.friends[index] === friend_id) {
            this.friends.splice(index, 1) 
            if (auto_call) {
                var user: IUser = await getUserById(friend_id).catch((err: Error) => Promise.reject(new Error(err.message)))
                await user.removeFriend(this._id, false).catch((err: Error)=> Promise.reject(new Error(err.message)))
            }
            return this.save()
        }
    }
    return Promise.reject(new Error("There's no id equal to that" + friend_id))
}

UserSchema.methods.removeFriends = async function( friend_ids: Types.ObjectId ) : Promise<void> {
    var id: Types.ObjectId
    var failures: [string]
    for (id  of  friend_ids) {
        await this.removeFriend(id).catch((err: Error) => failures.push(err.message))
    }
    return (!failures)? Promise.resolve() : Promise.reject(new Error("Errors occured: " + failures))
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
    this.roles.forEach((element: string) => {
        if (element === role.valueOf()) value = true;
    });

    return value;
}

UserSchema.methods.isFriend = function( key: Types.ObjectId ) : boolean {
    let value : boolean = false
    this.friends.forEach((element: Types.ObjectId) => {
        if (element === key) value = true
    });

    return value;
}

export async function getUserById( _id : Types.ObjectId ) : Promise<IUser> {
    var userData = await User.findOne({ _id }).catch((err: Error) => Promise.reject(new Error("No user with that id")))
    return Promise.resolve(new User(userData))
}

export async function getUserByUsername( username : string ) : Promise<IUser> {
    var userData = await User.findOne({ username }).catch((err: Error) => Promise.reject(new Error("No user with that username")))
    return Promise.resolve(new User(userData))
}

export const User: Model<IUser> = mongoose.model("User", UserSchema, "users")

