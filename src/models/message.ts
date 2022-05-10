import mongoose from 'mongoose'


var messageSchema = new mongoose.Schema({
    content:  {
        type: mongoose.SchemaTypes.String,
        required: true 
    },

    timestamp: {
        type: mongoose.SchemaTypes.Date,
        required: true
    },

    author: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },

    receiver: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },

    viewed: {
        type: mongoose.SchemaTypes.Boolean
    }
})