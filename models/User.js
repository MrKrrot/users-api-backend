const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    pass: String,
    name: String,
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v

        delete returnedObject.pass
    },
})

module.exports = model('User', userSchema)
