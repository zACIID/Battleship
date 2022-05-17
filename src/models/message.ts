import {Schema, SchemaTypes, Types} from 'mongoose';

/**
 * Interface that represents a chat message.
 */
export interface Message {
    content: string;
    timestamp: Date;
    author: Types.ObjectId;
}

export const MessageSchema = new Schema<Message>({
    content: {
        type: SchemaTypes.String,
        required: true,
    },

    timestamp: {
        type: SchemaTypes.Date,
        required: true,
    },

    author: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
});
