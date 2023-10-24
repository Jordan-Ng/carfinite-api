module.exports = (sequelize, Sequelize) => {
    const CarListing = sequelize.define("car_listing", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        make: {
            type: Sequelize.STRING,
            allowNull: false
        },
        model: {
            type: Sequelize.STRING,
            allowNull: false
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        trim: {
            type: Sequelize.STRING,
            allowNull: false
        },
        year: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        color: {
            type: Sequelize.STRING,
            allowNull: false
        },
        mileage: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        transmission: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fuel_type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        drivetrain: {
            type: Sequelize.STRING,
            allowNull: false
        },
        title_status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        price: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
    },{
        timestamps: false,
        tableName: "car_listing"
    })

    const User = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    },{
        timestamps: false
    })

    const Session = sequelize.define("session", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        token: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },{
        timestamps: true,
        tableName: "session"
    })
    

    CarListing.belongsTo(User, {foreignKey: "user_id"})
    User.hasMany(Session, {foreignKey: "user_id"})

    return {
        CarListing: CarListing,
        User: User,
        Session: Session
    }
}