import mongoose from 'mongoose'


var matchSchema = new mongoose.Schema({

    player_1: mongoose.SchemaTypes.ObjectId,

    player_2: mongoose.SchemaTypes.ObjectId,

    players_chat: mongoose.SchemaTypes.ObjectId,

    observers_chat: mongoose.SchemaTypes.ObjectId
})


export default mongoose.model('Match', matchSchema);