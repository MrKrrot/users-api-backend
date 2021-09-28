const { Schema, model } = require('mongoose')

const teamSchema = new Schema({
    logo: String,
    players: [
        {
            type: Object,
            ref: 'User',
        },
    ],
    captain: {
        type: String,
        ref: 'User',
    },
    teamName: {
        type: String,
        unique: true,
    },
})

teamSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    },
})

const Team = model('Team', teamSchema)

module.exports = Team
