const express = require('express')
const dotenv = require("dotenv")
const authMiddleware = require("./middlewares/auth.js")

const app = express()
const controller = require("./controller.js")

dotenv.config()


app.get('/', (req, res) => {
    let routes = app._router.stack.map(r => r.route?.path)
    routes = routes.filter(route => route && route != "/")
    res.send({routes : routes})
})

app.use(express.json())

app.post('/register', controller.handleRegister)

app.post("/login", controller.handleLogin)



// authentication controlled endpoints
app.use(authMiddleware.authenticateToken)

app.get('/listings', controller.handleGetAllListings)






// binding app socket to port
app.listen(process.env.SERVER_PORT, () => {
    console.log(`App bound and running on port ${process.env.SERVER_PORT}`)
})