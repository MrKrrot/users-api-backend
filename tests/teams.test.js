const Team = require('../models/Team')
const { api } = require('./helpers')
const mongoose = require('mongoose')
const { server } = require('../index')

describe.only('creating a new team', () => {
    beforeEach(async () => {
        await Team.deleteMany({})
        const team = new Team({
            logo: '/images/ZHE.png',
            players: [{ id: '6153deaeea961a9a1d381af2' }],
            captain: '6153deaeea961a9a1d381af2',
            teamName: 'Zanahorias Estelares',
        })

        await team.save()
    })

    test('works as expected creating a team', async () => {
        const teamsDB = await Team.find({})
        const teamsAtStart = teamsDB.map(team => team.toJSON())

        const newTeam = {
            logo: '/images/UTM.png',
            players: [
                {
                    id: '6153deaeea961a9a1d381af2',
                },
            ],
            captain: '6153deaeea961a9a1d381af2',
            teamName: 'Universidad Tecnológica de Matamoros',
        }

        await api
            .post('/api/teams')
            .send(newTeam)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const teamsDBAfter = await Team.find({})
        const teamsAtEnd = teamsDBAfter.map(team => team.toJSON())

        expect(teamsAtEnd).toHaveLength(teamsAtStart.length + 1)

        const captains = teamsAtEnd.map(t => t.captain)
        expect(captains).toContain(newTeam.captain)
    })

    test('creation fails with proper statuscode and message if name team is already taken', async () => {})

    afterAll(() => {
        mongoose.connection.close()
        server.close()
    })
})
