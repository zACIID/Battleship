import { Schema, SchemaTypes, Types } from 'mongoose';
import exp from 'constants';

/**
 * Interface that represents a chat message.
 */
export interface Message {
    author: Types.ObjectId;
    content: string;
    timestamp: Date;
}

/**
 * Interface that represents a Message sub-document of a chat
 */
export interface MessageSubDocument extends Message, Types.EmbeddedDocument {}

export const MessageSchema = new Schema<Message>({
    author: {
        type: SchemaTypes.ObjectId,
        required: true,
    },

    content: {
        type: SchemaTypes.String,
        required: true,
    },

    timestamp: {
        type: SchemaTypes.Date,
        required: true,
        default: Date.now,
    },
});
