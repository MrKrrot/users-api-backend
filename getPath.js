const fs = require('fs')

const getUserPath = async username => {
    const files = await fs.promises.opendir(
        `${process.env.HOME_CLOUD_STORAGE}/${username}`
    )
    return files
}

module.exports = getUserPath
