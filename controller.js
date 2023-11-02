const { User, CarListing, Session, sequelize } = require("./models");
const {
  hashPassword,
  validatePassword,
  generateAccessToken,
} = require("./helper/auth");

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
  const getListings = await CarListing.findAll();
  return res.status(200).send({ data: getListings });
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
