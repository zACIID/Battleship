import * as mongoose from "mongoose";
import {Document, Model, Schema, SchemaTypes, Types} from "mongoose";
import {IChat, ChatSchema} from "./chat";


export interface IStats extends Document {
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


export interface IUser extends Document {
    username: string;
    mail: string;
    friends: [Types.ObjectId];
    chats: [IChat];
    stats: IStats;
    roles: [string];
    salt: string;
    pwd_hash: string;

    addFriends(friend_ids: [Types.ObjectId]): void;
    setRole(role: string): void;
    removeRole(role: string): void;
    isModerator(): boolean;
    isAdmin(): boolean;
    hasRole(role: string): boolean;
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
        required: true 
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


// TODO setRole(role: string), removeRole(role: string)

UserSchema.methods.isModerator = function() : boolean {
    return this.hasRole("moderator")
}

UserSchema.methods.isAdmin = function() : boolean {
    return this.hasRole("admin")
}

UserSchema.methods.hasRole = function(role: string) : boolean {
    let value: boolean = false;
    this.roles.forEach(element => {
        if (element === role) {
            value = true;
        }
    });

    return value;
}

export const User: Model<IUser> = mongoose.model("User", UserSchema, "users")

