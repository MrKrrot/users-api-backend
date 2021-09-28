const supertest = require('supertest')
const { app } = require('../index')
const bcrypt = require('bcrypt')

const api = supertest(app)

const initialUsers = [
    {
        username: 'MrKrrot',
        pass: 'MiPass48',
        name: 'Rafael Olguin',
    },
    {
        username: 'TheWither855',
        pass: 'OtraPass4861',
        name: 'Juancho Banderas',
    },
]

const getAllUsernamesFromUsers = async () => {
    const res = await api.get('/api/users')
    for (const userHash of initialUsers) {
        const passHash = await bcrypt.hash(userHash.pass, 10)
        userHash.pass = passHash
    }
    return { user: res.body.map(user => user.username), res }
}

module.exports = { api, initialUsers, getAllUsernamesFromUsers }
