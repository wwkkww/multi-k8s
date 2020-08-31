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

pgClient.on('connect', () => {
  pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.log('error creating pg table:', err))
})
// pgClient.on('error', () => console.log('PG connection lost'))

// pgClient
//   .query('CREATE TABLE IF NOT EXIST values (number INT)')
//   .catch(err => console.log('error creating pg table:', err))

// setup redis client
const redis = require('redis')
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
})

const redisPublisher = redisClient.duplicate()

// express route
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values')
  res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
  // use callback. redis on nodejs does not support promise async/await
  redisClient.hgetall('values', (err, values) => {
    res.send(values)
  })
})

app.post('/values', async (req, res) => {
  const index = req.body.index

  if (parseInt(index) > 41) {
    // 422: Unprocessable Entity
    return res.status(422).send('Index too high')
  }

  redisClient.hset('values', index, 'Nothing yet!')

  // trigger 'insert' event & send to worker process
  redisPublisher.publish('insert', index)

  pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

  res.send({ working: true })
})

app.listen(5000, () => {
  console.log('Server started on port:5000')
})
