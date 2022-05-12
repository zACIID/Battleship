import mongoose from 'mongoose'


export interface IUser extends Document{
    username: string,
    mail: string,
    
}


const statsSchema: mongoose.Schema = new mongoose.Schema({

    elo: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    }, 
    wins: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    }, 
    losses: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    }, 
    ship_destroyed:{ 
        type :mongoose.SchemaTypes.Number,
        default: 0
    }, 
    total_shots: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    hits: {
       type: mongoose.SchemaTypes.Number,
       default: 0
    }
})

const userSchema: mongoose.Schema = new mongoose.Schema({

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

    chats: {
        type: [mongoose.SchemaTypes.ObjectId]
    }, 

    stats: statsSchema,

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


export default mongoose.model('User', userSchema);

