const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (req, res) => {
    const { body } = req
    const { username } = body

    const user = await User.findOne({ username })
    const passCorrect =
        user === null ? false : await bcrypt.compare(body.pass, user.pass)

    if (!passCorrect) {
        res.status(401).json({
            error: 'invalid user or password',
        })
    }

    res.send({
        name: user.name,
        username: user.username,
    })
})

module.exports = loginRouter
