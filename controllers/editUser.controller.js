const editUserRouter = require('express').Router()
const User = require('../models/User')

editUserRouter.put('/:id', (req, res) => {
    const { id } = req.params
    const user = req.body

    const newUserInfo = {
        pass: user.pass,
    }

    User.findByIdAndUpdate(id, newUserInfo, { new: true }).then(result => {
        res.json(result)
    })
})

module.exports = editUserRouter
