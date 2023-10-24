const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")
const {User, Session} = require("../models")

dotenv.config()


module.exports.generateAccessToken = function(username) {
    return jwt.sign({name: username}, process.env.TOKEN_SECRET, {expiresIn: '365d'})
}

module.exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]
    
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload) => {
        if (err) return res.sendStatus(403)
        
        const getSession = await User.findOne({
            where: {username: payload.name},
            include: [{
                model: Session,
                where: {token: token},
                required: true
            }]
        })
        
        if (!getSession) return res.status(401).json({message: "Stale token"})

        req.user = getSession
        next()
    })

}