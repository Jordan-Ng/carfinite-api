const bycrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const saltRounds = 5

exports.hashPassword = async (password) => { 
    const salt = await bycrypt.genSalt(saltRounds)
    const hashedPassword = await bycrypt.hash(password, salt)
    
    return hashedPassword
}

exports.validatePassword = async (password, hashedPassword) => {
   return await bycrypt.compare(password, hashedPassword)
}

exports.generateAccessToken = function(username) {
    return jwt.sign({name: username}, process.env.TOKEN_SECRET, {expiresIn: '365d'})
}