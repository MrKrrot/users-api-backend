const createUserRouter = require('express').Router()
const bcrypt = require('bcrypt')
const fs = require('fs')
const User = require('../models/User')
createUserRouter.post('/', async (req, res, next) => {
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
        team: user.team,
    })

    try {
        const savedUser = await newUser.save()
        fs.mkdirSync(`${process.env.HOME_CLOUD_STORAGE}\\${savedUser.username}`)
        res.status(201).json(savedUser)
    } catch (err) {
        next(err)
    }
})

module.exports = createUserRouter
