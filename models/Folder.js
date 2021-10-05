const { Schema, model } = require('mongoose')

const folderSchema = new Schema({
    folderName: String,
    user: String,
    path: String,
    parentPath: String,
    children: Array,
})

module.exports = model('Folder', folderSchema)
