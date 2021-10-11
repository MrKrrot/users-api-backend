const editUserRouter = require('express').Router()
const bcrypt = require('bcrypt')
const fs = require('fs')
const User = require('../models/User')
const Folder = require('../models/Folder')
const getUserPath = require('../getPath')

// Edit user password
editUserRouter.put('/', async (req, res, next) => {
    const { userId } = req
    const newPass = req.body.pass
    if (!newPass) {
        return res.status(400).json({ message: 'No password was specified' })
    }
    try {
        const passHash = await bcrypt.hash(newPass, 10)
        const newUserInfo = {
            pass: passHash,
        }
        await User.findByIdAndUpdate(userId, newUserInfo, { new: true })

        return res.json({ message: 'Password changed succesfully' })
    } catch (err) {
        next(err)
    }
})

// Delete User Route
editUserRouter.delete('/', async (req, res, next) => {
    const { userId } = req
    try {
        await Folder.deleteMany({ user: userId })
        const user = await User.findByIdAndDelete(userId)
        const dir = await getUserPath(user.username)
        const userPath = dir.path
        fs.rmdirSync(userPath, { recursive: true })
        dir.close()
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

module.exports = editUserRouter
