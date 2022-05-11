import mongoose from 'mongoose'


var chatSchema = new mongoose.Schema({

    users: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: true
    },

    messages: [{

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

    }]

    
})