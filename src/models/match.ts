import * as mongoose from "mongoose";
import {Document, Model, Schema, Types, SchemaTypes} from "mongoose";
import {Chat, IChat} from "./chat";

/**
 * Interface that represents a Match document.
 * Such document represents a match between two players and the two types
 * of chatroom that such match supports.
 */
export interface IMatch extends Document {
    player_1: Types.ObjectId;
    player_2: Types.ObjectId;
    players_chat: IChat;
    observers_chat: IChat;
}

export const MatchSchema = new Schema<IMatch>({
    player_1: SchemaTypes.ObjectId,

    player_2: SchemaTypes.ObjectId,

    players_chat: Chat,

    observers_chat: Chat
});

export const Match: Model<IMatch> = mongoose.model("Match", MatchSchema, "matches");
