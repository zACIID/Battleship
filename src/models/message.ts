import {Schema, SchemaTypes, Types} from 'mongoose';

/**
 * Interface that represents a chat message.
 */
export interface Message {
    author: Types.ObjectId;
    content: string;
    timestamp: Date;
}

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
    },
});
