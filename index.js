'use strict'

const express = require('express')
express()
const port = 8010

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

const util = require('util')

const buildSchemas = require('./src/schemas')

db.run = util.promisify(db.run)
db.get = util.promisify(db.get)
db.all = util.promisify(db.all)

db.serialize(() => {
    buildSchemas(db)
    const app = require('./src/app')(db)
    app.listen(port, () => console.log(`App started and listening on port ${port}`))
})
