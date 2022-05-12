import * as mongoose from "mongoose";
import {Document, Model, Schema, Types, SchemaTypes} from "mongoose";


export interface IMessage extends Document {
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


export interface IChat extends Document {
    users: [Types.ObjectId];
    messages: [IMessage];
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

export const Chat: Model<IChat> = mongoose.model("Chat", ChatSchema, "chats")
