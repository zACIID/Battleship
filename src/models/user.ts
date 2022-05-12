import * as mongoose from "mongoose";
import {Document, Model, Schema, SchemaTypes} from "mongoose";



var statsSchema = new mongoose.Schema({

    elo: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
        index: true
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
        unique: true, 
        index: true
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


userSchema.methods.addFriends = function( data: [] ) : void {
    for(var id of data){
        if (id !== this._id)
            this.friends.push(id)
    }
}

userSchema.methods.setModerator = function() : void {
    if(!this.isModerator())
        this.role.push("moderator")
}

userSchema.methods.setAdmin = function() : void {
    if (!this.isAdmin())
        this.role.push("admin")
}

userSchema.methods.hasRole = function( role: string ) : boolean {
    var value: boolean = false;
    this.roles.array.forEach(element => {
        if (element === role) value = true;
    });
    return value;
}

userSchema.methods.isModerator = function() : boolean {
    return this.hasRole("moderator")
}

userSchema.methods.isAdmin = function( role: string ) : boolean {
    return this.hasRole("admin")
}


