const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

// Conection to MongoDB
mongoose
    .connect(connectionString)
    .then(() => {
        console.log('Database connected')
    })
    .catch(err => {
        console.error('Ocurrió un error al conectarse a la base de datos: ' + err)
    })

process.on('uncaughtException', () => {
    mongoose.connection.off()
    console.log('Database disconnected')
})
