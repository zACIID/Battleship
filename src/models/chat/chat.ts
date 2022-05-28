import * as mongoose from 'mongoose';
import { Document, Model, Schema, Types, SchemaTypes } from 'mongoose';
import { UserDocument, getUserById } from '../user/user';

import { Message, MessageSubDocument, MessageSchema } from './message';

/**
 * Interface that represents a Chat between different users of the system.
 */
export interface Chat {
    users: Types.ObjectId[];
    messages: Message[];
}

/**
 * Interface that represents a Chat document, which is the
 * internal representation of a Chat object in the database.
 * It also exposes some useful methods to update the state of the chat
 * document in the database.
 */
export interface ChatDocument extends Chat, Document {
    /**
     * Array of Message sub-documents
     */
    messages: Types.DocumentArray<MessageSubDocument>;

    /**
     * Adds the provided user_id into this instance of chat
     * @param user_id ObjectId of the user to add
     */
    addUser(user_id: Types.ObjectId): Promise<ChatDocument>;

    /**
     * Removes the provided user into this instance of chat
     * @param user_id ObjectId of the user to add
     */
    removeUser(user_id: Types.ObjectId): Promise<ChatDocument>;

    /**
     * Adds the messages into the "messages" field of this chat
     * @param content text of the new message
     * @param timestamp date when message has been sent
     * @param author ObjectId of the author of the message
     */
    addMessage(content: string, timestamp: Date, author: Types.ObjectId): Promise<ChatDocument>;
}

export const ChatSchema = new Schema<ChatDocument>({
    users: {
        type: [SchemaTypes.ObjectId],
        default: [],
    },
    messages: {
        type: [MessageSchema],
        default: [],
    },
});

ChatSchema.methods.addUser = async function (user_id: Types.ObjectId): Promise<ChatDocument> {
    if (!this.users.includes(user_id)) {
        this.users.push(user_id);
        return this.save();
    } else return Promise.reject(new Error('this id is already in the array: ' + user_id));
};

ChatSchema.methods.removeUser = async function (user_id: Types.ObjectId): Promise<ChatDocument> {
    let user: UserDocument;
    for (const idx in this.users) {
        if (this.users[idx] === user_id) {
            console.log('user detectato');
            this.users.splice(parseInt(idx), 1);
            return this.save();
        }
    }
    return Promise.reject(new Error('No user with that identifier'));
};

ChatSchema.methods.addMessage = async function (
    content: string,
    timestamp: Date,
    author: Types.ObjectId
): Promise<ChatDocument> {
    console.log('author');
    console.log(author);
    console.log('content');
    console.log(content);
    this.messages.push({ content, timestamp, author });
    return this.save();
};

export async function getChatById(_id: Types.ObjectId): Promise<ChatDocument> {
    const chatData = await ChatModel.findOne({ _id }).catch((err: Error) =>
        Promise.reject(new Error('Internal server error Bro'))
    );
    return !chatData
        ? Promise.reject(new Error('No chat with that identifier'))
        : Promise.resolve(chatData);
}

export async function deleteChat(_id: Types.ObjectId): Promise<void> {
    await ChatModel.deleteOne({ _id }).catch((err: Error) =>
        Promise.reject('An error occurred: ' + err.message)
    );
    return Promise.resolve();
}

/**
 * Creates a chat with the provided users
 * @param users contains a list of users objectId that can also be empty
 * @returns the newly created ChatDocument's object
 */
export async function createChat(users: Types.ObjectId[]): Promise<ChatDocument> {
    const chat = new ChatModel({ users });
    return chat.save();
}

// Create "Chats" collection
export const ChatModel: Model<ChatDocument> = mongoose.model('Chat', ChatSchema, 'Chats');