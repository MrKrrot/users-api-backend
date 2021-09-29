const mongoose = require('mongoose')
const { server } = require('../index')
const User = require('../models/User')
const { api, initialUsers, getAllUsernamesFromUsers } = require('./helpers')

beforeEach(async () => {
    await User.deleteMany({})

    for (const user of initialUsers) {
        const userObject = new User(user)
        await userObject.save()
    }
})

describe('GET all users', () => {
    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are two users', async () => {
        const { res } = await getAllUsernamesFromUsers()
        expect(res.body).toHaveLength(initialUsers.length)
    })

    test('one of the users is MrKrrot', async () => {
        const { user } = await getAllUsernamesFromUsers()

        expect(user).toContain('MrKrrot')
    })
})

describe('create a user', () => {
    test('is possible with valid info', async () => {
        const newUser = {
            username: 'Oddy',
            pass: 'MiPass',
            name: 'Karen',
            team: 'Zanahorias Estelares',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const { user, res } = await getAllUsernamesFromUsers()

        expect(res.body).toHaveLength(initialUsers.length + 1)
        expect(user).toContain(newUser.username)
    })

    test('is not possible without some info', async () => {
        const newUser = {
            username: 'Oddy',
            name: 'Karen',
            team: 'Zanahorias Estelares',
        }

        await api.post('/api/users').send(newUser).expect(400)

        const res = await api.get('/api/users')

        expect(res.body).toHaveLength(initialUsers.length)
    })
})

describe('delete a user', () => {
    test('is possible with a valid ID', async () => {
        const { res: res1 } = await getAllUsernamesFromUsers()
        const { body: users } = res1
        const userToDelete = users[0]

        await api.delete(`/api/users/${userToDelete.id}`).expect(204)

        const { user, res: res2 } = await getAllUsernamesFromUsers()

        expect(res2.body).toHaveLength(initialUsers.length - 1)

        expect(user).not.toContain(userToDelete.username)
    })

    test('is not possible with an invalid ID', async () => {
        await api.delete('/api/users/1234').expect(400)

        const { res } = await getAllUsernamesFromUsers()

        expect(res.body).toHaveLength(initialUsers.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
    server.close()
})
