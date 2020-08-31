const keys = require('./keys')

// setup express
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// setup postgres client
const { Pool } = require('pg')
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
})

pgClient.on('error', () => console.log('PG connection lost'))

pgClient
  .query('CREATE TABLE IF NOT EXIST values (number INT)')
  .catch(err => console.log('error creating pg table:', err))
