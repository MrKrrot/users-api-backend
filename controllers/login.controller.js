const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (req, res) => {
    const { body } = req
    const { username } = body

    const user = await User.findOne({ username })
    const passCorrect =
        user === null ? false : await bcrypt.compare(body.pass, user.pass)

    if (!(user && passCorrect)) {
        res.status(401).json({
            error: 'invalid user or password',
        })
    }

    const userForToken = {
        id: user._id,
        username: user.username,
    }

    const token = jwt.sign(userForToken, process.env.SECRET_TOKEN, {
        expiresIn: 60 * 60 * 24 * 7,
    })

    res.send({
        name: user.name,
        username: user.username,
        token,
    })
})

module.exports = loginRouter
