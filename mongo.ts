const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

// Conection to MongoDB
mongoose
    .connect(connectionString)
    .then(() => {
        console.log('Database connected')
    })
    .catch((err: Error) => {
        console.error('Ocurrió un error al conectarse a la base de datos: ' + err)
    })

process.on('uncaughtException', error => {
    console.error(error)
    mongoose.disconnect()
    console.log('Database disconnected')
})
