const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const login = asyncHandler(async(req, res) => {
    const {
        phoneNumber,  
        password
    } = req.body

    if (!phoneNumber || !password) return res.status(400).json({ message: 'Phone and password are required.' })

    const foundUser = await User.findOne({ phoneNumber }).exec()

    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) return res.status(401).json({ message: 'Unauthorized: wrong password.' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser._id,
                "firstName": foundUser.firstName,
                "lastName": foundUser.lastName,
                "phoneNumber": foundUser.phoneNumber,
            }
        },
        process.env.ACCESS_TOKEN_SECRET, 
        // { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "phoneNumber": foundUser.phoneNumber },
        process.env.REFRESH_TOKEN_SECRET,
        // { expiresIn: '7d' }
    )
    res.cookie('jwt', refreshToken, {
        httpOnly: false, 
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    
    res.json({ accessToken })
})

const logout = (req, res) => {

    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204).json({ message: 'No Content' })
    
    res.clearCookie('jwt', { expiresIn: new Date(0)})
    res.json({ message: 'Cookie cleared' })
}

module.exports = { login , logout}
