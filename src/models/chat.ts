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
