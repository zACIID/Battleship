import * as mongoose from "mongoose";
import {Document, Model, Schema, SchemaTypes} from "mongoose";


const messageSchema = new Schema({
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


// TODO come si fa a ricercare che una chat corrisponde a due soli utenti?
//  bisogna controllare che nella lista di user ci siano esattamente due utenti e che siano esattamente quei due?
const chatSchema = new Schema({

    users: {
        type: [SchemaTypes.ObjectId],
        required: true
    },

    messages: [messageSchema]
})

export const Chat: Model<Document> = mongoose.model("Chat", chatSchema)
