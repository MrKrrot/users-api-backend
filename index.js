require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const teamsRouter = require('./controllers/createTeams.controller')
const loginRouter = require('./controllers/login.controller')
const createUserRouter = require('./controllers/createUser.controller')
const deleteUserRouter = require('./controllers/deleteUser.controller')
const editUserRouter = require('./controllers/editUser.controller')
const getUserRouter = require('./controllers/getUser.controller')
const getAllUsersRouter = require('./controllers/getAllUsers.controller')
const userExtractor = require('./middlewares/userExtractor')
const notFound = require('./middlewares/notFound')
const handleError = require('./middlewares/handleError')
const fileRouter = require('./controllers/fileRouter.controller')
const folderRouter = require('./controllers/createFolder.controller')

const app = express()

app.use(cors())
app.use('/images', express.static('images'))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Hola Mundo</h1>')
})

// Route to get all the users from the DB
app.use('/api/users', getAllUsersRouter)
// Route to get a user by ID
app.use('/api/users/', getUserRouter)
// Route to create a user
app.use('/api/users', createUserRouter)
// Route to edit a user by ID
app.use('/api/users/', userExtractor, editUserRouter)
// Route to delete a user by ID
app.use('/api/users/', userExtractor, deleteUserRouter)
// Route to create teams
app.use('/api/teams', userExtractor, teamsRouter)
// Route to login in
app.use('/api/login', loginRouter)
// Route to create a folder
app.use('/fm/create', userExtractor, folderRouter)
// Route to get all user's files
app.use('/fm/', userExtractor, fileRouter)
// If the route does not exists. This route send an error 404
app.use(notFound)

app.use(handleError)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

module.exports = { app, server }
