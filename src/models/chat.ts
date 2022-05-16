import * as mongoose from "mongoose";
import {Document, Model, Schema, Types, SchemaTypes} from "mongoose";


/**
 * Interface that represent a message sub-document found in a Chat document.
 *
 * This does not extend Document because it represents a sub-document,
 * so it does not need Document methods/fields like _id, __v, save(), etc.
 */
export interface IMessage {
    content: string;
    timestamp: Date;
    author: Types.ObjectId;

}

export const MessageSchema = new Schema<IMessage>({
    content:  {
        type: SchemaTypes.String,
        required: true
    },

    timestamp: {
        type: SchemaTypes.Date,
        required: true
    },

    author: {
        type: SchemaTypes.ObjectId,
        required: true
    }
})

/**
 * Interface that represents a Chat document.
 * Such document represents a chat between different users of the system.
 */
export interface IChat extends Document {
    users: Types.ObjectId[];
    messages: IMessage[];
    
    addUser(user_id: Types.ObjectId) : Promise<IChat>;

    removeUser(user_id: Types.ObjectId) : Promise<IChat>;

    addMessage(content: string, timestamp: Date, author: Types.ObjectId);

}

export const ChatSchema = new Schema<IChat>({
    users: {
        type: [SchemaTypes.ObjectId],
        required: true
    },
    messages: {
        type: MessageSchema,
        default: []
    }
})

ChatSchema.methods.addUser = async function( user_id: Types.ObjectId) : Promise<IChat> {
    if (!this.users.includes(user_id)) {
        this.users.push(user_id)
        
        return this.save()
    }
    else return Promise.reject(new Error("this id is already in the array: " + user_id))
}

ChatSchema.methods.removeUser = async function(user_id: Types.ObjectId) : Promise<IChat> {
    for(let idx in this.users){
        if (this.users[idx] === user_id)
            this.users.splice(parseInt(idx), 1);
    }
    return this.save();
}

ChatSchema.methods.addMessage = async function( content: string, timestamp: Date, author: Types.ObjectId) : Promise<IChat> {
    this.messages.push({content, timestamp, author});
    return this.save();
}


export async function getChatById( _id : Types.ObjectId ) : Promise<IChat> {
    var chatData = await Chat.findOne({ _id }).catch((err: Error) => Promise.reject(new Error("No chat with that id")))
    return Promise.resolve(new Chat(chatData))
}



export const Chat: Model<IChat> = mongoose.model("Chat", ChatSchema, "chats")
