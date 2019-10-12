'use strict'

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MessageSchema = Schema({
    from:String,
    room:String,
    timestamp: Date,
    text: String
})

module.exports = mongoose.model('Message',MessageSchema);