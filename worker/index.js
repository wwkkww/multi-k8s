const keys = require('./keys')
const redis = require('redis')

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  // attempt to reconnect every 1 second if redisClient lost connection with redis server
  retry_strategy: () => 1000,
})

const sub = redisClient.duplicate()

// fib sequence: 0,1,1,2,3,5,8,13,21,34,....
// Recursive solution => (2^N) time complexity
function fib(index) {
  if (index < 2) return 1

  return fib(index - 1) + fib(index - 2)
}

// run when new value receive by redis
sub.on('message', (channel, message) => {
  // hset('values', 6, 8)
  redisClient.hset('values', message, fib(parseInt(message)))
})

// listen to 'insert' event from express server
sub.subscribe('insert')
