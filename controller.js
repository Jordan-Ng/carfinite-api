const {User, CarListing, Session, Image, ListingImage, sequelize} = require("./models")
const {hashPassword, validatePassword, generateAccessToken} = require("./helper/auth")
const {unlinkFiles} = require("./helper/fileHandler")


exports.handleRegister = async (req, res) => {
  let request = req.body;

  const getUser = await User.findOne({ where: { username: request.username } });

  if (getUser) {
    return res
      .status(400)
      .json({ message: "user with username already exists" });
  }

  request.password = await hashPassword(request.password);

  try {
    await sequelize.transaction(async (t) => {
      await User.create(request, { transaction: t });
    });
  } catch (error) {
    return res.status(500).send("something went wrong on our side!");
  }

  return res.status(200).json({ message: "OK" });
};

exports.handleLogin = async (req, res) => {
  const getUser = await User.findOne({
    where: { username: req.body.username },
  });

  if (!getUser) {
    return res.status(404).json({ message: "User does not exist" });
  }

  const isAuthenticated = await validatePassword(
    req.body.password,
    getUser.password
  );

  if (isAuthenticated) {
    const accessToken = generateAccessToken(getUser.username);

    try {
      await sequelize.transaction(async (t) => {
        await Session.create(
          {
            user_id: getUser.id,
            token: accessToken,
          },
          { transaction: t }
        );
      });
    } catch (error) {
      return res.status(500).send("something went wrong on our side!");
    }

    return res.status(200).json({ token: accessToken });
  }

  return res.status(401).json({ message: "invalid credentials" });
};

exports.handleGetAllListings = async (req, res) => {
    const getAllListings = await CarListing.findAll({        
        include: [{
            model: ListingImage,            
            required: true,
            include: [
                {                    
                    attributes: ["filename"],                    
                    model: Image,
                    as: "image"                    
                }]
        }]
    })
    return res.status(200).send({data: getAllListings})
};

exports.handleSignout = async (req, res) => {
  const user = req.user;

  try {
    await sequelize.transaction(async (t) => {
      await Session.destroy(
        {
          where: {
            user_id: user.id,
            token: req.headers["authorization"].split(" ")[1],
          },
        },
        { transaction: t }
      );
    });
    return res.status(200).json({ message: "Successfully signed out" });
  } catch (error) {
    return res.status(500).send("something went wrong on our side!");
  }
};

exports.handlePostListing = async (req, res) => {    
    if (req.errors) {
        unlinkFiles(req.files)
        return res.status(400).send({message: req.errors})
    }

    const user = req.user
    
    const formData = {
        make: req.body.make,
        model:req.body.model,
        user_id: user.id,
        trim: req.body.trim,
        year: req.body.year,
        color: req.body.color,
        mileage: req.body.mileage,
        transmission: req.body.transmission,
        fuel_type: req.body.fuel_type,
        drivetrain: req.body.drivetrain,
        title_status: req.body.title_status,
        price: req.body.price,
        description:req.body.description
    }

    const isValidForm = Object.values(formData).filter(value => value).length == Object.keys(formData).length
        
        if (!isValidForm){
            unlinkFiles(req.files)
            return res.status(400).send({message: "incomplete form"})
        }
    
    
    try {
        await sequelize.transaction(async t => {
            const carlisting = await CarListing.create(formData, {transaction: t})
            
            const imageFilenames = req.files.map(file => ({
                filename: file.filename
            }))
            
            const imageIds = await Image.bulkCreate(imageFilenames, {transaction: t})
            
            const carListing_images = imageIds.map(image => ({
                image_id : image.id,
                car_listing_id : carlisting.id
            }))            
            
            await ListingImage.bulkCreate(carListing_images, {transaction: t})

        })
    }
    catch (error) {
        return res.status(500).send({
            message: "something went wrong on our end! ",
            description: error.message
        })
    }
    
    return res.status(201).send({message: "Car Listing successfully posted!"})
}
    
exports.handleGetListing = async (req, res) => {
    const getListing = await CarListing.findOne({
        where: {id: req.params.id},
        include: [
            {
                model: UserLikedListing,
                attributes: ["user_id", "listing_id"],
                as: "listing_liked_by",                              
                where: {                    
                    listing_id: req.params.id
                }
            },
            {
                model: UserLikedListing,
                as: "listing_liked",
                where: {
                    listing_id : req.params.id,
                    user_id: req.user.id
                }
            }            
        ]
    })

    if (!getListing){
        return res.status(404).send({message: "listing not found"})
    }

    let responseData = getListing.toJSON()
    responseData.listing_liked_by = responseData.listing_liked_by.length
    responseData.listing_liked = responseData.listing_liked.length > 0    
    

    return res.status(200).send({data: responseData})
}


exports.handleLikeListing = async (req, res) => {
    const getListing = await CarListing.findOne({
        attributes : ["id"],
        where: {id: req.params.id}
    })

    if (!getListing){
        return res.status(404).send({message: "listing not found"})
    }

    try {
        await sequelize.transaction(async t => {
            await UserLikedListing.create({
                user_id: req.user.id,
                listing_id: getListing.id
            })
        })
    }
    catch (err) {
        if (err.code == "ER_DUP_ENTRY"){
            return res.status(400).send({
                message: "Cannot like listing more than once!"
            })
        }
        return res.status(500).send({
            message: err.message,
            description: err.errors[0].message
    })
    }

    return res.status(200).send({message: "Listing liked!"})
}

exports.handleUnlikeListing = async (req, res) => {
    const getListing = await CarListing.findOne({
        attributes: ["id"],
        where: {id: req.params.id}
    })

    if (!getListing){
        return res.status(404).send({message: "listing not found"})
    }

    try {
        await sequelize.transaction(async t => {
            await UserLikedListing.destroy({
                where: {
                    user_id: req.user.id,
                    listing_id: getListing.id
                }
            })
        })
    }
    catch (err) {
        return res.status(500).send({
            message: err.message,
            description: err.errors[0].message
        })
    }

    return res.status(200).send({message: "Unliked listing"})

}
