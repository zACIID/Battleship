import * as mongoose from "mongoose";
import {Document, Model, Schema, SchemaTypes} from "mongoose";
import {Chat} from "./chat" ;


const matchSchema = new Schema({

    player_1: SchemaTypes.ObjectId,

    player_2: SchemaTypes.ObjectId,

    /* TODO perché qui non embedding?
    players_chat: [Chat],

    observers_chat: [Chat]
    */

    players_chat: SchemaTypes.ObjectId,

    observers_chat: SchemaTypes.ObjectId
});

export const Match: Model<Document> = mongoose.model("Match", matchSchema);
