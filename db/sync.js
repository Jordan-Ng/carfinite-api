const db = require('../models')

db.sequelize.sync({force: true}).then(() => {
    console.log("synced db")
    db.sequelize.close()
}).catch(err => {
    console.log('failed', err)
    db.sequelize.close()
})