const { response } = require('express')
const express = require('express')
const logger = require('./middlewares/logger')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.use(logger)

let data = [
    {
        "id": 1,
        "username": "MrKrrot",
        "pass": "fd4f8sdg6GSSAFDA68SF&SAD25",
        "name": "Rafael"
    },
    {
        "id": 2,
        "username": "TheWither855",
        "pass": "f63FA697sV_$5as61&$#",
        "name": "Juancho"
    },
    {
        "id": 3,
        "username": "Oddy",
        "pass": "&DA61$dff_asa/6ajpPs_",
        "name": "Karen"
    },
    {
        "id": 4,
        "username": "pou",
        "pass": "fd4_frtvTY_#aFH/v",
        "name": "Isaac"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hola Mundo</h1>')
})

app.get('/api/users', (req, res) => {
    res.json(data)
})

app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id)
    const user = data.find(user => user.id === id)

    if(user) {
        res.json(user)
    } else {
        res.status(404).json({
            error: 'User Not Found'
        })
    }
})

app.delete('/api/users/:id', (req, res) => {
    const id = Number(req.params.id)
    data = data.filter(user => user.id !== id)
    res.status(204).end()
})

app.post('/api/users', (req, res) => {
    const user = req.body

    if(!user || !user.username || !user.pass || !user.name) {
        return res.status(400).json({
            error: 'user info is missing'
        })
    }

    const newUser = {
        id: data.length + 1,
        username: user.username,
        pass: user.pass,
        name: user.name
    }

    data = [...data, newUser]

    res.status(201).json(newUser)
})

app.use((req, res) => {
    res.status(404).json({error: 'Not Found'})
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})