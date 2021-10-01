const teamsRouter = require('express').Router()
const Team = require('../models/Team')
const User = require('../models/User')

teamsRouter.get('/', async (req, res) => {
    const teams = await Team.find({})
    res.json(teams)
})

teamsRouter.post('/', async (req, res, next) => {
    const { players, logo, teamName, captain } = req.body

    const { userId } = req
    const user = await User.findById(userId)

    if (!logo || !teamName || !captain) {
        return res.status(400).json({
            error: 'team info is missing',
        })
    }

    const newTeam = new Team({
        teamName,
        players,
        logo,
        captain: user._id,
    })

    try {
        const savedTeam = await newTeam.save()
        user.teamName = savedTeam.teamName
        await user.save()

        res.status(201).json(savedTeam)
    } catch (err) {
        next(err)
    }
})

module.exports = teamsRouter
