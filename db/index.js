const mysql = require("mysql2")
const fs = require('fs')

require("dotenv").config()

const targetScript = process.argv.slice(2)[0]

const sqlScript = fs.readFileSync(targetScript, {encoding: "utf-8"})

// db connection
const db= mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    multipleStatements: true
})

db.connect()

db.query(sqlScript, err => {
    if (err){
        throw err
    }

    console.log("seed/setup completed. check your GUI/workbench")
    db.end()
})