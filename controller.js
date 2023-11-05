const { User, CarListing, Session, Images, CarImage, sequelize } = require("./models")
const { hashPassword, validatePassword, generateAccessToken } = require("./helper/auth")
const upload = require('./middlewares/upload');
const { where } = require("sequelize")


exports.handleRegister = async (req, res) => {
    let request = req.body

    const getUser = await User.findOne({ where: { username: request.username } })

    if (getUser) {
        return res.status(400).json({ message: "user with username already exists" })
    }

    request.password = await hashPassword(request.password)

    try {
        await sequelize.transaction(async t => {
            await User.create(request, { transaction: t })
        })
    }
    catch (error) {
        return res.status(500).send("something went wrong on our side!")
    }

    return res.status(200).json({ message: "OK" })
}

exports.handleLogin = async (req, res) => {
    const getUser = await User.findOne({ where: { username: req.body.username } })

    if (!getUser) {
        return res.status(404).json({ message: "User does not exist" })
    }

    const isAuthenticated = await validatePassword(req.body.password, getUser.password)

    if (isAuthenticated) {
        const accessToken = generateAccessToken(getUser.username)

        try {
            await sequelize.transaction(async t => {
                await Session.create({
                    user_id: getUser.id,
                    token: accessToken
                }, { transaction: t })
            })

        }
        catch (error) {
            console.log(error.message)
            return res.status(500).send("something went wrong on our side!")
        }

        return res.status(200).json({ token: accessToken })
    }

    return res.status(401).json({ message: "invalid credentials" })
}

exports.handleNewListing = async (req, res) => {
    const getUser_id = req.user.id
    try {
        upload(req, res, async err => {

            if (err) {
                console.log(err);
                return res.send('somthing went wrong, file not successfully uploaded');
            }

            const request = req.body
            await sequelize.transaction(async (t) => {
                // Create a new car listing associated with the user.
                const newCarListing = await CarListing.create({
                    make: request.make,
                    model: request.model,
                    user_id: getUser_id,
                    trim: request.trim,
                    year: request.year,
                    color: request.color,
                    mileage: request.mileage,
                    transmission: request.transmission,
                    fuel_type: request.fuel_type,
                    drivetrain: request.drivetrain,
                    title_status: request.title_status,
                    price: request.price,
                    description: request.description,
                }, { transaction: t });

                
                await Promise.all(req.files.map(async (file) => {
                    const newImage = await Images.create({
                        filename: "" + file.filename
                    }, { transaction: t });

                    await CarImage.create({
                        car_id: newCarListing.id,
                        image_id: newImage.id,
                    }, { transaction: t });
                }));

            });

        });
        
        return res.status(200).json({ message: "New car listing created successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Something went wrong on our side!");
    }
}

exports.handleGetAllListings = async (req, res) => {
    const getListings = await CarListing.findAll()
    return res.status(200).send({ data: getListings })
}