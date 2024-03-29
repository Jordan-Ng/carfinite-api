const dbConfig = require("../config/db.config.js")

const Sequelize = require("sequelize")
const sequelize = new Sequelize (dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
})

const {CarListing, User, Session, Image, ListingImage, UserLikedListing} = require('./models.js')(sequelize, Sequelize)

const db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    CarListing : CarListing,
    User: User,
    Session: Session,
    Image: Image,
    ListingImage: ListingImage,
    UserLikedListing: UserLikedListing
}

module.exports = db;


