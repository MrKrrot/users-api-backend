require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const User = require('./models/User')

const teamsRouter = require('./controllers/teams')
const notFound = require('./middlewares/notFound')
const handleError = require('./middlewares/handleError')

const app = express()

app.use(cors())
app.use('/images', express.static('images'))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Hola Mundo</h1>')
})

app.get('/api/users', async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

app.get('/api/users/:id', (req, res, next) => {
    const { id } = req.params

    User.findById(id)
        .then(user => {
            // return the user if exists, else return 404
            return user ? res.json(user) : res.status(404).end()
        })
        .catch(err => next(err))
})

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params
    const user = req.body

    const newUserInfo = {
        pass: user.pass,
    }

    User.findByIdAndUpdate(id, newUserInfo, { new: true }).then(result => {
        res.json(result)
    })
})

app.delete('/api/users/:id', async (req, res, next) => {
    const { id } = req.params
    try {
        await User.findByIdAndDelete(id)
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

app.post('/api/users', async (req, res, next) => {
    const user = req.body

    if (!user || !user.username || !user.pass || !user.name) {
        return res.status(400).json({
            error: 'user info is missing',
        })
    }

    const passHash = await bcrypt.hash(user.pass, 10)

    const newUser = new User({
        username: user.username,
        pass: passHash,
        name: user.name,
    })

    /*newUser.save().then(savedUser => {
        res.status(201).json(savedUser)
    }) */

    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (err) {
        next(err)
    }
})

app.use('/api/teams', teamsRouter)

app.use(notFound)

app.use(handleError)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

module.exports = { app, server }
