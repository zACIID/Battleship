import mongoose from 'mongoose'


var matchChatSchema = new mongoose.Schema({
    content:  {
        type: mongoose.SchemaTypes.String,
        required: true 
    },

    timestamp: {
        type: mongoose.SchemaTypes.Date,
        required: true
    },

    username: {
        type: mongoose.SchemaTypes.String,  
        required: true
    },
})


var matchSchema = new mongoose.Schema({

    player1: mongoose.SchemaTypes.ObjectId,

    player2: mongoose.SchemaTypes.ObjectId,

    players_chat: [matchChatSchema],

    observers_chat: [matchChatSchema]
})