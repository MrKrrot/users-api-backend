require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const loginRouter = require('./controllers/login.controller')
const userRouter = require('./controllers/user.controller')
const editUserRouter = require('./controllers/editUser.controller')
const userExtractor = require('./middlewares/userExtractor')
const notFound = require('./middlewares/notFound')
const handleError = require('./middlewares/handleError')
const fileRouter = require('./controllers/files.controller')
const folderRouter = require('./controllers/folder.controller')

const app = express()

// Middlewares
app.use(cors())
app.use('/images', express.static('images'))
app.use(express.json())

// Route to get users or create a user
app.use('/api/users', userRouter)
// Route to edit or delete a user
app.use('/api/user', userExtractor, editUserRouter)
// Route to login in
app.use('/api/login', loginRouter)
// Route to create a folder
app.use('/fm/create', userExtractor, folderRouter)
// Route to get all user's files
app.use('/fm', userExtractor, fileRouter)
// If the route does not exists. This route send an error 404
app.use(notFound)

app.use(handleError)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

module.exports = { app, server }
