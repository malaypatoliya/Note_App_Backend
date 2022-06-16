const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tag:{
        type: String,
        required: true
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
})

const Note =  mongoose.model('note', NoteSchema);

module.exports = Note;