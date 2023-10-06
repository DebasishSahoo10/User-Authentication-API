const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  email: { type: String },
  profilePicture: { type: String },
  contactNumber: { type: String },
}, { timestamps: true })
const User = mongoose.model('User', userSchema)
module.exports = User;