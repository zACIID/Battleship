import * as mongoose from "mongoose";
import {Document, Model, Schema, Types, SchemaTypes} from "mongoose";
import {Chat, IChat} from "./chat";


/**
 * Interface that represent a stats sub-document found in a Match document.
 *
 */
 export interface IMatchStats {
    winner: Types.ObjectId;
    start_time: Date;
    end_time: Date;
    total_shots: number;
    ships_destroyed: number;
}

export const MatchStatsSchema = new Schema<IMatchStats>({
    winner: {
        type: SchemaTypes.ObjectId
    },
    start_time: {
        type: SchemaTypes.Date,
        required: true
    },
    end_time: {
        type: SchemaTypes.Date
    },
    total_shots: {
        type: SchemaTypes.Number,
        default: 0
    },
    ships_destroyed: {
        type: SchemaTypes.Number,
        default: 0
    },

})



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
    stats: IMatchStats;
}

export const MatchSchema = new Schema<IMatch>({
    player_1: SchemaTypes.ObjectId,

    player_2: SchemaTypes.ObjectId,

    players_chat: Chat,

    observers_chat: Chat,

    stats: MatchStatsSchema

});

export const Match: Model<IMatch> = mongoose.model("Match", MatchSchema, "matches");
