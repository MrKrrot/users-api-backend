const ERROR_HANDLERS = {
    CastError: res => res.status(400).send({ error: 'id used is malformed' }),
    ValidationError: (res, { message }) => {
        res.status(409).send({ error: message })
    },
    JsonWebTokenError: res => {
        res.status(401).json({ error: 'token missing or invalid' })
    },
    TokenExpirerError: res => res.status(401).json({ error: 'token expired' }),
    EEXIST: res => res.status(400).json({ error: 'Folder already exists' }),
    defaultError: (res, error) => res.status(500).json({ error: error }),
}

module.exports = (err, req, res, next) => {
    if (err.code === 'EEXIST') {
        const handler = ERROR_HANDLERS[err.code]
        handler(res, err)
    } else {
        const handler = ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError

        handler(res, err)
    }
}
