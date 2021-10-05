const folderRouter = require('express').Router()
const fs = require('fs')
const User = require('../models/User')
const Folder = require('../models/Folder')

folderRouter.post('/', async (req, res, next) => {
    const folderName = req.body.name
    const { userId } = req
    if (!folderName) {
        return res.send(400).json({ message: 'No name was specified' })
    }

    const user = await User.findById(userId)
    try {
        await fs.promises.mkdir(
            `${process.env.HOME_CLOUD_STORAGE}\\${user.username}\\${folderName}`
        )

        const newFolder = new Folder({
            folderName,
            user: userId,
            parentPath: '/',
            path: `/${folderName}`,
            children: [],
        })

        const savedFolder = await newFolder.save()

        res.json({
            message: 'Directory created',
            folder: savedFolder.folderName,
        })
    } catch (err) {
        next(err)
    }
})

folderRouter.post('/:path', async (req, res, next) => {
    const path = req.params.path
    const folderName = req.body.name
    const { userId } = req
    try {
        const parentFolder = await Folder.findById(path)
        const user = await User.findById(userId)
        if (!parentFolder) {
            return res
                .status(400)
                .json({ message: 'This folder does not exists' })
        }

        await fs.promises.mkdir(
            `${process.env.HOME_CLOUD_STORAGE}/${user.username}/${parentFolder.path}/${folderName}`
        )

        const newFolder = new Folder({
            folderName,
            user: userId,
            parentPath: `${parentFolder.path}`,
            path: `${parentFolder.path}/${folderName}`,
            children: [],
        })

        const savedFolder = await newFolder.save()

        const updateParentFolder = {
            id: newFolder._id,
            folderName,
        }

        await Folder.findByIdAndUpdate(
            path,
            { $push: { children: updateParentFolder } },
            { new: true }
        )
        res.json({
            message: 'Directory created',
            folder: savedFolder.folderName,
        })
    } catch (err) {
        next(err)
    }
})

module.exports = folderRouter