const fs = require('fs')

exports.unlinkFiles = (files) => {
    files.forEach(file => fs.unlinkSync(file.path))
}