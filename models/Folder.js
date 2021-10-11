const { Schema, model } = require('mongoose')

const folderSchema = new Schema({
    folderName: String,
    user: String,
    path: String,
    parentPath: String,
    children: Array,
})

folderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    },
})

module.exports = model('Folder', folderSchema)
