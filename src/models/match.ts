import * as mongoose from "mongoose";
import {Document, Model, Schema, Types, SchemaTypes} from "mongoose";
import {Chat, IChat} from "./chat";


export interface IMatch extends Document {
    player_1: Types.ObjectId,
    player_2: Types.ObjectId,
    players_chat: IChat,
}

const matchSchema = new Schema<IMatch>({
    player_1: SchemaTypes.ObjectId,

    player_2: SchemaTypes.ObjectId,

    players_chat: Chat,

    observers_chat: Chat
});

export const Match: Model<IMatch> = mongoose.model("Match", matchSchema, "matches");
