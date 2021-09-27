module.exports = (err, req, res, next) => {
    console.error(err)

    if(err.name === 'CastError') {
        res.status(400).send({error: 'id used is malformed'})
    } else {
        res.status(500).end()
    }

}