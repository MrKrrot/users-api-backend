const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const fs = require('fs')
const User = require('../models/User')

// Get All Users Route
userRouter.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

// Get User By Id
userRouter.get('/:id', (req, res, next) => {
    const { id } = req.params

    User.findById(id)
        .then(user => {
            // return the user if exists, else return 404
            return user ? res.json(user) : res.status(404).end()
        })
        .catch(err => next(err))
})

// Create User Route
userRouter.post('/', async (req, res, next) => {
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

// Edit user password
userRouter.put('/:id', (req, res) => {
    const { id } = req.params
    const user = req.body

    const newUserInfo = {
        pass: user.pass,
    }

    User.findByIdAndUpdate(id, newUserInfo, { new: true }).then(result => {
        res.json(result)
    })
})

// Delete User Route
userRouter.delete('/:id', async (req, res, next) => {
    const { id } = req.params
    try {
        await User.findByIdAndDelete(id)
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

module.exports = userRouter
