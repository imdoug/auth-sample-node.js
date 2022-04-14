
// -------------------------------
// initiating mongoose to create user Schema 
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// This is a sample so my user will only contain Username, 
// Email and Password but you can get this code and add as much fields as you want.
// Email and Username must be unique so we dont duplicates in our db .
const UserSchema = Schema({
      username: { type: String, unique: true, required: true},
      email: { type: String, unique: true, required: true },
      password: { type: String, required: true}
})

const User = mongoose.model('User', UserSchema)

module.exports = User;