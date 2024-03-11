require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger, logEvents } = require('./middleware/logEvents')
const errorHandler  = require('./middleware/errorHandler')
const credentials = require('./middleware/credentials')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConnect')
const PORT = process.env.PORT || 3500
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


// connect to MongoDB
connectDB()

// set limit
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}))

// custom logger middleware
app.use(logger)

// handle options credentials check before CORS and fetch cookies credentials requirement
app.use(credentials)

// using cors options for managing request and sharing the server
app.use((cors(corsOptions)))

// built-in middleware to handle urlencoded data (form data)
app.use(express.urlencoded({ extended: false }))

// built-in middleware to handle json
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

// serve static files
app.use('/', express.static(path.join(__dirname, 'public')))

// Custom Error handling
app.use(errorHandler)

// routes
app.use('/', require('./routes/root'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/authRoutes'))

// Custom 404 page
// app.all('*', (req, res) => {
//     res.status(404)
//     if(req.accepts('html')) res.sendFile(path.join(__dirname, 'views', '404.html'))
//     else if(req.accepts('json')) res.json({error: "404 Not Found!"})
//     else res.type('txt').send("404 Not Found!")
// })

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    server
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
