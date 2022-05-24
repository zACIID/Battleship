import { Schema, SchemaTypes, Types } from 'mongoose';

/**
 * Interface that represents relationship information for some user.
 */
export interface Relationship {
    friendId: Types.ObjectId;
    chatId?: Types.ObjectId;
}

/**
 * Interface that represents a relationship sub-document
 */
export interface RelationshipSubDocument extends Relationship, Types.EmbeddedDocument {}

export const RelationshipSchema = new Schema<Relationship>({
    friendId: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    chatId: {
        type: SchemaTypes.ObjectId
    },
});
