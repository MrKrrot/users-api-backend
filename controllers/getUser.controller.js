const getUserRouter = require('express').Router()
const User = require('../models/User')

getUserRouter.get('/:id', (req, res, next) => {
    const { id } = req.params

    User.findById(id)
        .then(user => {
            // return the user if exists, else return 404
            return user ? res.json(user) : res.status(404).end()
        })
        .catch(err => next(err))
})

module.exports = getUserRouter
