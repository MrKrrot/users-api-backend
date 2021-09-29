const getAllUsersRouter = require('express').Router()
const User = require('../models/User')

getAllUsersRouter.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

module.exports = getAllUsersRouter
