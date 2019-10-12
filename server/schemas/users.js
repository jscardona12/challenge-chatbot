'use strict'

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = Schema({
    username:String,
    password:String,
    online: Boolean,
    room: String,
    socketId: String
})

module.exports = mongoose.model('User',UserSchema);