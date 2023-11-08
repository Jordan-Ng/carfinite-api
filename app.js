const express = require('express')
const dotenv = require("dotenv")

const authMiddleware = require("./middlewares/auth.js")
const uploadMiddleware = require("./middlewares/image.js")


const app = express();
const controller = require("./controller.js");

dotenv.config();

app.get("/", (req, res) => {
  let routes = app._router.stack.map((r) => r.route?.path);
  routes = routes.filter((route) => route && route != "/");
  res.send({ routes: routes });
});

app.use(express.json())
app.use(express.urlencoded({extended: true}))



app.post('/register', controller.handleRegister)

app.post("/login", controller.handleLogin)

// authentication controlled endpoints
app.use(authMiddleware.authenticateToken)
app.use("/images", express.static(__dirname + "/assets/images"))

app.get('/listings/all', controller.handleGetAllListings)

app.get("/listings", controller.handleGetMyListing)

app.post("/listing/new", uploadMiddleware.upload("files") , controller.handlePostListing)

app.get("/listing/:id", controller.handleGetListing)

app.post("/listing/:id/like", controller.handleLikeListing)

app.delete("/listing/:id/unlike", controller.handleUnlikeListing)



// binding app socket to port
app.listen(process.env.SERVER_PORT, () => {
  console.log(`App bound and running on port ${process.env.SERVER_PORT}`);
});

//signout
app.delete("/signout", controller.handleSignout);
