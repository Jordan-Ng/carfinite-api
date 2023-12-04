const {User, CarListing, UserLikedListing, Session, Image, ListingImage, sequelize} = require("./models")
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
        attributes: [
            "id",            
            "make",
            "model",
            "trim",
            "year",
            "color",
            "mileage",
            "transmission",
            "fuel_type",
            "drivetrain",
            "title_status",
            "price",
            "description",
            // [sequelize.fn('count', sequelize.col("listing_liked_by.listing_id")), "like_count"],
            [sequelize.fn('count', sequelize.col("listing_liked.listing_id")), "liked"],            
        ],        
        include: [
            {
                model: ListingImage,
                as: "listing_images",
                separate: true,
                attributes: [[sequelize.col("image.filename"), "filename"]],
                include: [
                    {
                        model: Image,
                        as: "image",
                        attributes: [],                        
                    }
                ]
            },
            {
                model: User,
                as: "owner",
                attributes: ["username", "first_name", "last_name"]
            },
            {
                model: UserLikedListing,                
                attributes: ["user_id"],
                separate: true,
                required: false,                
                as: "listing_liked_by",                                
            },
            {
                model: UserLikedListing,
                as: "listing_liked",
                attributes: [],
                required: false,
                where: {                        
                    user_id: req.user.id
                }
            }   
        ],
        group: ["id"]
        // group: ["listing_liked.listing_id"]
    })

    const formattedResponse = getAllListings.map(listing => {
        return {
            id: listing.id,
            make: listing.make,
            model: listing.model,
            owner_first_name: listing.owner.first_name,
            owner_last_name : listing.owner.last_name,
            specifications: {
                trim: listing.trim,
                year: listing.year,
                color: listing.color,
                mileage: listing.mileage,
                transmission: listing.transmission,
                fuel_type: listing.fuel_type,
                drivetrain: listing.drivetrain,
                title_status: listing.title_status
            },
            price: listing.price,
            description: listing.description,
            images: listing.dataValues.listing_images.map(file => (file.dataValues.filename)),
            liked: Boolean(listing.dataValues.liked),
            liked_count: listing.dataValues.listing_liked_by.length
        }
    })
    // return res.status(200).send({data: getAllListings})
    return res.status(200).send({data: formattedResponse})
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
        drivetrain: req.body.drive_train,
        title_status: req.body.title_status,
        price: req.body.price,
        description:req.body.description
    }
    
    const isValidForm = Object.values(formData).filter(value => value).length == Object.keys(formData).length
        
        if (!isValidForm){
            unlinkFiles(req.files)
            return res.status(400).send({message: "incomplete form"})
        }
    
        formData["user_id"] = user.id
    try {
        await sequelize.transaction(async t => {
            const carlisting = await CarListing.create(formData, {transaction: t})
            
            const imageFilenames = req.files.map(file => ({
                filename: file.filename
            }))
            
            const imageIds = await Image.bulkCreate(imageFilenames, {transaction: t})
            
            const carListing_images = imageIds.map(image => ({
                image_id : image.id,
                listing_id : carlisting.id
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
        attributes: [
            "make",
            "model",
            "trim",
            "year",
            "color",
            "mileage",
            "transmission",
            "fuel_type",
            "drivetrain",
            "title_status",
            "price",
            "description",
            // [sequelize.fn('count', sequelize.col("listing_liked_by.listing_id")), "like_count"],
            [sequelize.fn('count', sequelize.col("listing_liked.listing_id")), "liked"],            
        ], 
        where: {id: req.params.id},
        include: [
            {
                model: ListingImage,
                as: "listing_images",
                separate: true,                
                attributes: [[sequelize.col("image.filename"), "filename"]],
                include: [
                    {
                        model: Image,
                        as: "image",
                        attributes: []
                    }
                ]
            },
            {
                model: User,
                as: "owner",
                attributes: ["username", "first_name", "last_name"]
            },            
            {
                model: UserLikedListing,                                                                    
                attributes:["user_id"],                              
                as: "listing_liked_by",
                required: false,
                separate: true,                
                where: {                    
                    listing_id: req.params.id
                }                
            },
            {
                model: UserLikedListing,
                as: "listing_liked",
                attributes: [],
                required: false,                                
                where: {
                    listing_id : req.params.id,
                    user_id: req.user.id
                }
            }            
        ],                
        group: ["listing_liked.listing_id"]
    })

    if (!getListing){
        return res.status(404).send({message: "listing not found"})
    }

    let responseData = getListing.toJSON()
    
    const formattedResponse = {
            make: responseData.make,
            model: responseData.model,
            owner_first_name: responseData.owner.first_name,
            owner_last_name : responseData.owner.last_name,
            specifications: {
                trim: responseData.trim,
                year: responseData.year,
                color: responseData.color,
                mileage: responseData.mileage,
                transmission: responseData.transmission,
                fuel_type: responseData.fuel_type,
                drivetrain: responseData.drivetrain,
                title_status: responseData.title_status
            },
            price: responseData.price,
            description: responseData.description,
            images: responseData.listing_images.map(file => (file.filename)),
            liked: Boolean(responseData.liked),
            liked_count: responseData.listing_liked_by.length
    }
    
    return res.status(200).send({data: formattedResponse})
}

exports.handleGetMyListing = async(req, res) => {
    const userListings = await CarListing.findAll({
        attributes: [
            "id",
            "make",
            "model",
            "trim",
            "year",
            "color",
            "mileage",
            "transmission",
            "fuel_type",
            "drivetrain",
            "title_status",
            "price",
            "description",
            [sequelize.fn('count', sequelize.col("listing_liked_by.listing_id")), "liked_count"],
            [sequelize.fn('count', sequelize.col("listing_liked.listing_id")), "liked"],            
        ],
        where: {
            user_id: req.user.id
        },
        include: [
            {
                model: ListingImage,
                as: "listing_images",
                separate: true,
                attributes: [[sequelize.col("image.filename"), "filename"]],
                include: [
                    {
                        model: Image,
                        as: "image",
                        attributes: [],                        
                    }
                ]
            },
            {
                model: UserLikedListing,                
                attributes: [],
                required: false,                
                as: "listing_liked_by",                                
            },
            {
                model: UserLikedListing,
                as: "listing_liked",
                attributes: [],
                required: false,
                where: {                        
                    user_id: req.user.id
                }
            }   
        ],
        group: ["id"]
    })

    const formattedResponse = userListings.map(listing => {
        return {
            id: listing.id,
            make: listing.make,
            model: listing.model,
            owner_first_name: req.user.first_name,
            owner_last_name : req.user.last_name,
            specifications: {
                trim: listing.trim,
                year: listing.year,
                color: listing.color,
                mileage: listing.mileage,
                transmission: listing.transmission,
                fuel_type: listing.fuel_type,
                drivetrain: listing.drivetrain,
                title_status: listing.title_status
            },
            price: listing.price,
            description: listing.description,
            images: listing.dataValues.listing_images.map(file => (file.dataValues.filename)),
            liked: Boolean(listing.dataValues.liked),
            liked_count: listing.dataValues.liked_count
        }
    })
    return res.status(200).send({data: formattedResponse})
    // return res.status(200).send({data: userListings})
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
        
        if (err.errors[0].type == "unique violation"){
            return res.status(400).send({
                message: "Cannot like listing more than once!"
            })
        }
        return res.status(500).send({
            message: err.message
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
        console.log("cannot find listing")
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

exports.handleAuthenticate = async (req, res) => {
    return res.status(200).json({user: req.user.username})
}