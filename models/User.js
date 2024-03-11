const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phoneNumber: {type: String, required: true, maxLength: 11, maxLength: 11 },
    password: {type: String, required: true},
})

module.exports = mongoose.model('User', userSchema)