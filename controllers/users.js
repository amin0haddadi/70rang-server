const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length) return res.status(400).json({message : 'BAD REQUEST : No users found'})
    res.status(200).json(users)
})

const createUser = asyncHandler(async(req, res) => {
    const {
        firstName,
        lastName,
        phoneNumber,
        password
    } = req.body

    if(!firstName || !lastName || !phoneNumber || !password  )
        return res.status(400).json({ message : 'BAD REQUEST : All fields are required' })

    const duplicate = await User.findOne({ phoneNumber }).lean().exec()
    if(duplicate)
        return res.status(409).json({ message: 'CONFLICT : This username already exists!' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({firstName, lastName, phoneNumber, "password":hashedPassword })

    if(user) res.status(201).json({ message: `CREATED: User ${phoneNumber} created successfully!` })
    else res.status(400).json({ message: 'BAD REQUEST : Invalid user data recieved' })
})  

const deleteUser = asyncHandler(async (req, res) => {

    const { id } = req.body
    if(!id) return res.status(400).json({ message : 'BAD REQUEST : User id required' })
  
    const user = await User.findById(id).exec()
    if(!user) return res.status(400).json({ message: 'BAD REQUEST : User not found' })
  
    const deletedUser = await user.deleteOne()
    const reply = `Username ${deletedUser.username} with ID ${deletedUser.id} deleted successfully!`
    res.status(200).json(reply)
  })
  

module.exports = { createUser, getAllUsers, deleteUser }