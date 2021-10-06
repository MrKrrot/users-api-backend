const fileRouter = require('express').Router()
const fileUpload = require('express-fileupload')
const User = require('../models/User')
const Folder = require('../models/Folder')
const getPath = require('../getPath')

fileRouter.use(fileUpload())

fileRouter.get('/', async (req, res, next) => {
    try {
        const { userId } = req

        const user = await User.findById(userId)
        const userPath = await getPath(user.username)
        const content = {
            files: [],
            directories: [],
        }
        // Selecciona todos los directorios de la raíz
        const userFolders = await Folder.find({ user: userId, parentPath: '/' })
        // Separación de directorios y archivos
        for await (const dirent of userPath) {
            if (dirent.isFile()) {
                content.files.push(dirent.name)
            }
        }
        for (const userFolder of userFolders) {
            content.directories.push({
                id: userFolder._id,
                name: userFolder.folderName,
            })
        }
        res.json(content).status(200)
    } catch (e) {
        next(e)
    }
})

fileRouter.get('/:path', async (req, res, next) => {
    const path = req.params.path
    const { userId } = req

    try {
        const parentFolder = await Folder.findById(path)
        const user = await User.findById(userId)
        if (!parentFolder) {
            return res
                .status(400)
                .json({ message: 'This folder does not exists' })
        }
        const userPath = await getPath(`${user.username}/${parentFolder.path}`)
        const content = {
            files: [],
            directories: [],
        }
        const userFolders = await Folder.find({
            user: userId,
            parentPath: parentFolder.path,
        })
        // Separación de directorios y archivos
        for await (const dirent of userPath) {
            if (dirent.isFile()) {
                content.files.push(dirent.name)
            }
        }
        for (const userFolder of userFolders) {
            content.directories.push({
                id: userFolder._id,
                name: userFolder.folderName,
            })
        }

        res.json(content).status(200)
    } catch (err) {
        next(err)
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
        const userPath = await getPath(user.username)
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

fileRouter.post('/:path', async (req, res, next) => {
    if (!req.files) {
        return res.status(400).json({ error: 'No files were uploaded' })
    }
    const path = req.params.path
    const { userId } = req

    let userFiles = req.files.files
    if (!Array.isArray(userFiles)) {
        userFiles = [userFiles]
    }
    try {
        const parentFolder = await Folder.findById(path)
        if (!parentFolder) {
            return res
                .status(400)
                .json({ message: 'This folder does not exists' })
        }
        const user = await User.findById(userId)
        const userPath = await getPath(`${user.username}/${parentFolder.path}`)
        for (const file of userFiles) {
            file.mv(`${userPath.path}/${file.name}`, err => {
                if (err) return res.status(500).json({ err })
            })
        }
        userPath.closeSync()
        res.status(201).json({ message: 'Files uploaded succesfully!' })
    } catch (err) {
        next(err)
    }
})

module.exports = fileRouter
