import * as mongoose from "mongoose";
import {Model, Schema, Types, SchemaTypes, Document} from "mongoose";


export interface IMessage extends Document{
    content: string,
    timestamp: Date,
    author: Types.ObjectId
}

const messageSchema = new Schema<IMessage>({
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


export interface IChat extends Document{
    
    users: [Types.ObjectId],
    messages: [IMessage]
}

const chatSchema = new Schema<IChat>({

    users: {
        type: [SchemaTypes.ObjectId],
        required: true
    },

    messages: {
        type: messageSchema,
        default: []
    }
})

export const Chat: Model<IChat> = mongoose.model("Chat", chatSchema, "chats")
