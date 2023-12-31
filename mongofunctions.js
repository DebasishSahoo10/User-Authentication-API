// const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const secret = 'SECRET GENERATED BY NODE'
const bcrypt = require('bcrypt')
const User = require('./Models/User.model')
const signup = async (userObject) => {
  const userExists = await User.findOne({ username: userObject.username })
  if (userExists) {
    throw new Error('Username Already Taken')
  } else {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(userObject.password, salt)
    const newUser = new User({ username: userObject.username, hashedPassword })
    const savedUser = await newUser.save()
    return { message: 'User Sucessfully Signed Up' }
  }
}
const login = async (userObject) => {
  const foundUser = await User.findOne({ username: userObject.username })
  if (foundUser) {
    try {
      const passwordMatch = await bcrypt.compare(userObject.password, foundUser.hashedPassword)
      if (passwordMatch) {
        // never send password for token signing, just username
        const token = jwt.sign({ username: foundUser.username }, secret, { expiresIn: '24h' })
        return { token }
      } else {
        throw new Error('Password did not match')
      }
    } catch (error) {
      throw new Error(error)
    }
  } else {
    throw new Error("No Such User Found")
  }
}
const changePassword = async (userObject) => {
  // username, current pass, new pass
  const foundUser = await User.findOne({ username: userObject.username })
  if (foundUser) {
    try {
      const passwordMatch = await bcrypt.compare(userObject.currPassword, foundUser.hashedPassword)
      if (passwordMatch) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(userObject.currPassword, salt)
        const updatedUser = await User.findOneAndUpdate({ username: userObject.username }, { hashedPassword }, { new: true })
        const token = jwt.sign({ username: updatedUser.username }, secret, { expiresIn: '24h' })
        return token
      } else {
        throw new Error('Current Password Did Not Match')
      }
    } catch (error) {
      throw new Error(error)
    }
  } else {
    throw new Error('No Such User')
  }
}
const updateProfilePicture = async (userObject) => {
  // username, profilePictureURL
  const foundUser = await User.findOne({ username: userObject.username })
  if (foundUser) {
    const updatedUser = await User.findOneAndUpdate({ username: userObject.username }, { profilePicture: userObject.profilePicture }, { new: true })
    return updatedUser.profilePicture
  } else {
    throw new Error('No Such User')
  }
}
const updateContactDetails = async (userObject) => {
  // username, updatedContact
  const foundUser = await User.findOne({ username: userObject.username })
  if (foundUser) {
    const updatedUser = await User.findOneAndUpdate({ username: userObject.username }, { contactNumber: userObject.contactNumber }, { new: true })
    return updatedUser.contactNumber
  } else {
    throw new Error('No Such User')
  }
}
const findUserByPhoneNumber = async (contactNumber) => {
  const foundUser = await User.findOne({ contactNumber: contactNumber })
  if (foundUser) {
    return foundUser
  } else {
    throw new Error('No User Matched')
  }
}
module.exports = { signup, login, changePassword, updateProfilePicture, updateContactDetails, findUserByPhoneNumber }