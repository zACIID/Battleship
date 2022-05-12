import * as mongoose from "mongoose";
import {Document, Model, Schema, SchemaTypes} from "mongoose";


const statsSchema = new Schema({

    elo: {
        type: SchemaTypes.Number,
        default: 0
    }, 
    wins: {
        type: SchemaTypes.Number,
        default: 0
    }, 
    losses: {
        type: SchemaTypes.Number,
        default: 0
    }, 
    ship_destroyed:{ 
        type: SchemaTypes.Number,
        default: 0
    }, 
    total_shots: {
        type: SchemaTypes.Number,
        default: 0
    },
    hits: {
       type: SchemaTypes.Number,
       default: 0
    }
})


const userSchema = new Schema({

    username: {
        type: SchemaTypes.String,
        required: true, 
        unique: true
    },

    mail: {
        type: SchemaTypes.String,
        required: true,
        unique: true, 
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/
    },

    friends: {
        type: [SchemaTypes.ObjectId]
    }, 

    chats: {
        type: [SchemaTypes.ObjectId]
    }, 

    stats: statsSchema,

    roles: {
        type: [SchemaTypes.String],
        required: true 
    },

    salt: {
        type: SchemaTypes.String,
        required: false 
    },

    pwd_hash: {
        type: SchemaTypes.String,
        required: false 
    }
})

export const User: Model<Document> = mongoose.model("User", userSchema)
