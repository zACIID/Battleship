import * as mongoose from 'mongoose';
import { Model, Schema, SchemaTypes, Types } from 'mongoose';
import bcrypt from 'bcrypt';

import { NotificationSchema, RequestNotification, RequestTypes } from './notification';
import { UserStats } from "./user-stats";
import { Relationship, RelationshipSchema } from "./relationship";
import { StatsSchema } from "./user-stats";
import { type } from 'os';
import { ChatDocument, ChatModel, createChat } from './chat';

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
     * Adds the provided role to this instance.
     * If the user already has the role, it is not added a second time.
     *
     * @param role role to be set
     */
    setRole(role: UserRoles): Promise<UserDocument>;

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

    /**
     * Add a relationship and automatically create a new chat object
     * @param friendId new friend's id  
     * @param chat_id optional param in order to trigger the symmetric addition
     */
    addRelationship(friendId: Types.ObjectId, chat_id?: Types.ObjectId): Promise<UserDocument>;

    /**
     * Remove a relationship from both users
     * @param friendId friend's id to delete
     * @param stop trigger the symmetric deletion of the relationship
     */
    removeRelationship(friendId: Types.ObjectId, stop?: boolean): Promise<UserDocument>;

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

    notifications:{
        type: [NotificationSchema],
        default: []
    },

    online: SchemaTypes.Boolean,
    
});

UserSchema.methods.addNotification = async function ( typeRequest: RequestTypes, requester: Types.ObjectId ): Promise<UserDocument> {
    
    for(let idx in this.notifications){
        if(this.notifications[idx].type === typeRequest && this.notifications[idx].sender === requester){
            return Promise.reject(new Error('Notification already sent'));
        }
    }
    let toInsert: RequestNotification;
    toInsert.type = typeRequest;
    toInsert.sender = requester;
    this.notifications.push(toInsert);
    return this.save();
};

UserSchema.methods.removeNotification = async function (
    typeRequest: RequestTypes,
    requester: Types.ObjectId
): Promise<UserDocument> {
    for (let idx in this.notifications) {
        if (
            this.notifications[idx].type === typeRequest &&
            this.notifications[idx].sender === requester
        )
            this.notifications.splice(parseInt(idx), 1);
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




/* METHODS FOR ROLES MANIPULATION  */

UserSchema.methods.removeRole = async function (role: UserRoles): Promise<UserDocument> {
    for (const idx in this.roles) {
        if (this.roles[idx] === role.valueOf()) this.roles.splice(parseInt(idx), 1);
    }
    return this.save();
};

UserSchema.methods.hasRole = function (role: UserRoles): boolean {
    let value = false;
    this.roles.forEach((element: string) => {
        if (element === role.valueOf()) value = true;
    });

    return value;
};

UserSchema.methods.setRole = async function (role: UserRoles): Promise<UserDocument> {
    if( !this.hasRole(role) ){
        this.roles.push(role.valueOf());
        return this.save();
    }
    return Promise.reject(new Error("Role already set"));
};

UserSchema.methods.isModerator = function (): boolean {
    return this.hasRole(UserRoles.Moderator);
};

UserSchema.methods.isAdmin = function (): boolean {
    return this.hasRole(UserRoles.Admin);
};

UserSchema.methods.addRelationship = async function (friendId: Types.ObjectId, chat_id?: Types.ObjectId): Promise<UserDocument> {

    for(let idx in this.relationships){
        if( this.relationships[idx].friendId === friendId ){
            return Promise.reject(new Error('Relationship already existent'));
        }
    }

    let toInsert: Relationship;
    toInsert.friendId = friendId;
    
    try{
        
        if(!chat_id){
            let chat: ChatDocument;
            chat = await createChat([this._id, friendId]);
            toInsert.chatId = chat._id
            await symmetricAddRelationship(friendId, this._id, chat._id);
        }
 
    }
    catch(err){
        return Promise.reject(new Error(err.message));
    }
    
    this.relationships.push(toInsert);

    return this.save();
    
};

const symmetricAddRelationship = async function (user_id: Types.ObjectId, friend_id: Types.ObjectId, chat_id: Types.ObjectId): Promise<UserDocument>{
    
    let user: UserDocument;
    try{
        user = await getUserById(user_id);
        return user.addRelationship(friend_id, chat_id);
    }
    catch(err){
        return Promise.reject(new Error(err.message));
    }
    
}


UserSchema.methods.removeRelationship = async function (friendId: Types.ObjectId, stop?: boolean): Promise<UserDocument> {

    for(let idx in this.relationships){
        if( this.relationships[idx].friendId === friendId ){

            

            this.relationships.splice(parseInt(idx), 1);

            if(!stop){
                try{
                    const chatId = this.relationships[idx].chatId;
                    await ChatModel.deleteOne({ chatId });
                    await symmetricRemoveRelationship(friendId, this._id);
                }
                catch(err){
                    return  Promise.reject(new Error(err.message));
                }
            }
        }
    }

    return this.save();
    
};

const symmetricRemoveRelationship = async function (user_id: Types.ObjectId, friend_id: Types.ObjectId): Promise<UserDocument>{
    
    let user: UserDocument;
    try{
        user = await getUserById(user_id);
        return user.removeRelationship(friend_id, true);
    }
    catch(err){
        return Promise.reject(new Error(err.message));
    }
    
}



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

    return (!userdata)? Promise.reject(new Error('No user with that username')) 
    : Promise.resolve(userdata)
}

export async function createUser(data): Promise<UserDocument> {
    getUserByUsername(data.username).catch((err) => {
        if (err.message === "No user with that username") {
            const user = new UserModel(data);
            return user.save();
        }
        return Promise.reject(new Error(err.message))
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

export async function getUsers( ids: Types.ObjectId[] ) : Promise<UserDocument[]> {
    let users: UserDocument[]
    try {
        users = await UserModel.find({ _id: { $in: ids }})
    }
    catch(err) {
        return Promise.reject(new Error("Sum internal error just occured"))
    }
    if (!users) return Promise.reject(new Error("None of the given ids are present in the db"))
    return (users.length === ids.length)? Promise.resolve(users) : Promise.reject(users)
}

export async function getLeaderboard() : Promise<UserDocument[]> {
    return UserModel.find({}, { _id: 1, username: 1, elo: 1 })
    .sort({ elo: -1 }).limit(20).catch((err: Error) => 
        Promise.reject(new Error("Sum internal error just occured"))
    )
}

export async function deleteUser( _id: Types.ObjectId ) : Promise<void> {
    const obj: { deletedCount?: number } = await UserModel.deleteOne({ _id })
    .catch( (err) => Promise.reject(new Error("Sum internal error just occured")))
    return (!obj.deletedCount)? Promise.reject(new Error('No user with that id')) : Promise.resolve()
}

export async function updateUserName( _id: Types.ObjectId, username: string) : Promise<void> {
    await getUserByUsername(username).catch(async (err) => {
        if (err.message === "No user with that username") {
            const query = await UserModel.updateOne({ _id }, { username })
            .catch((err) => Promise.reject(new Error("Sum internal error just occured"))) 
            return (query.n === 0)? Promise.reject(new Error("No user with that id")) : Promise.resolve() 
        }
        return Promise.reject(new Error(err.message))
    })
    return Promise.reject(new Error("Username already exists brah"))
}

export async function updatePassword( _id: Types.ObjectId, password: string) : Promise<void> {
    let user: UserDocument
    try {
        user = await getUserById(_id)
        await user.setPassword(password)
    }
    catch(err) {
       return Promise.reject(new Error(err.message)) 
    }
    return Promise.resolve()
}

export async function getUserStats( _id: Types.ObjectId ) : Promise<UserStats> {
    let stat: UserDocument = await UserModel.findOne({ _id }, { stats: 1 })
    .catch((err) => Promise.reject(new Error("Sum internal error just occured")))
    return (!stat)? Promise.reject(new Error("No user with that id")) : Promise.resolve(stat.stats)
}

export async function updateUserStats( _id: Types.ObjectId, elo: number, result: boolean, shipsDestroyed: number, shots: number, hits: number) : Promise<UserDocument> {
    let user: UserDocument
    try {
        user = await getUserById(_id)
    }
    catch(err) {
        return Promise.reject(new Error(err.message)) 
    }
    if (user.stats.topElo < user.stats.elo + elo) user.stats.topElo = user.stats.elo + elo;
    user.stats.elo += elo;
    (result)? user.stats.wins ++ : user.stats.losses --;
    user.stats.shipsDestroyed += shipsDestroyed;
    user.stats.totalShots += shots;
    user.stats.hits += hits
    return user.save()
}



