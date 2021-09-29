const deleteUserRouter = require('express').Router()
const User = require('../models/User')

deleteUserRouter.delete('/:id', async (req, res, next) => {
    const { id } = req.params
    try {
        await User.findByIdAndDelete(id)
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

module.exports = deleteUserRouter
