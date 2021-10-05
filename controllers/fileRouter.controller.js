const fileRouter = require('express').Router()
const fileUpload = require('express-fileupload')
const fs = require('fs')
const User = require('../models/User')

fileRouter.use(fileUpload())

fileRouter.get('/', async (req, res, next) => {
    try {
        const { userId } = req

        const user = await User.findById(userId)
        const files = await fs.promises.opendir(
            `${process.env.HOME_CLOUD_STORAGE}\\${user.username}`
        )
        const content = {
            files: [],
            directories: [],
        }
        // Separación de directorios y archivos
        for await (const dirent of files) {
            if (dirent.isDirectory()) {
                content.directories.push(dirent.name)
            } else {
                content.files.push(dirent.name)
            }
        }

        res.json(content).status(200)
    } catch (e) {
        next(e)
    }
})

fileRouter.post('/', async (req, res, next) => {
    try {
        if (!req.files) {
            return res.status(400).json({ error: 'No files were uploaded' })
        }
        const { userId } = req
        const user = await User.findById(userId)
        let userFiles = req.files.files
        if (!Array.isArray(userFiles)) {
            userFiles = [userFiles]
        }
        const userPath = await fs.promises.opendir(
            `${process.env.HOME_CLOUD_STORAGE}/${user.username}`
        )
        for (const file of userFiles) {
            file.mv(`${userPath.path}/${file.name}`, err => {
                if (err) return res.status(500).json({ error: err })
            })
        }
        userPath.closeSync()
        res.status(201).json({ message: 'Files uploaded succesfully!' })
    } catch (err) {
        next(err)
    }
})

module.exports = fileRouter
