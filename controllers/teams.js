const teamsRouter = require('express').Router()
const Team = require('../models/Team')

teamsRouter.post('/', async (req, res) => {
    const { body } = req
    const { players, logo, teamName, captain } = body

    const team = new Team({
        teamName,
        players,
        logo,
        captain,
    })

    const savedTeam = await team.save()

    res.status(201).json(savedTeam)
})

module.exports = teamsRouter
