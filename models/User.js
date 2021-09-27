const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: String,
    pass: String,
    name: String
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = model('User', userSchema)