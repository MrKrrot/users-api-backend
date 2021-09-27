require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const User = require('./models/User')

const notFound = require('./middlewares/notFound')
const handleError = require('./middlewares/handleError')

const app = express()

app.use(cors())
app.use('/images' ,express.static('images'))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Hola Mundo</h1>')
})

app.get('/api/users', (req, res) => {
    User.find({}).then(users => {
        res.json(users)
    })
})

app.get('/api/users/:id', (req, res, next) => {

    const { id } = req.params

    User.findById(id)
    .then(user => {
        // return the user if exists, else return 404
        return user
        ? res.json(user)
        : res.status(404).end()

    }).catch(err => next(err))
})

app.put('/api/users/:id', (req, res, next) => {
    const { id } = req.params
    const user = req.body

    const newUserInfo = {
        username: user.username,
        pass: user.pass
    }

    User.findByIdAndUpdate(id, newUserInfo, {new: true})
        .then(result => {
            res.json(result)
        })

})

app.delete('/api/users/:id', (req, res, next) => {
    const { id } = req.params

    User.findByIdAndDelete(id).then(result => {
        res.status(204).end()

    }).catch(err => next(err))

})

app.post('/api/users', (req, res) => {
    const user = req.body

    if(!user || !user.username || !user.pass || !user.name) {
        return res.status(400).json({
            error: 'user info is missing'
        })
    }
    const newUser = new User({
        username: user.username,
        pass: user.pass,
        name: user.name
    })

    newUser.save().then(savedUser => {
        res.status(201).json(savedUser)
    })

})

app.use(notFound)

app.use(handleError)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})