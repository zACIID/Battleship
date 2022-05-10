import mongoose from 'mongoose'


var userSchema = new mongoose.Schema({

    username: {
        type: mongoose.SchemaTypes.String,
        required: true, 
        unique: true
    },

    mail: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true, 
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/
    },

    friends: {
        type: [mongoose.SchemaTypes.ObjectId]
    }, 

    stats: {
        elo: mongoose.SchemaTypes.Number = 0, 
        wins: mongoose.SchemaTypes.Number = 0, 
        losses: mongoose.SchemaTypes.Number = 0, 
        ship_destroyed: mongoose.SchemaTypes.Number = 0, 
        total_shots: mongoose.SchemaTypes.Number = 0,
        hits: mongoose.SchemaTypes.Number = 0
    },

    roles: {
        type: [mongoose.SchemaTypes.String],
        required: true 
    },

    salt: {
        type: mongoose.SchemaTypes.String,
        required: false 
    },

    pwd_hash: {
        type: mongoose.SchemaTypes.String,
        required: false 
    }
})