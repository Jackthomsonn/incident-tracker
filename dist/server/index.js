/* eslint-disable no-console */
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 5001

app.use(express.static('dist'))

process.on('uncaughtException', function (err) {
  console.error(err)
})

app.use(bodyParser.json())
app.use('/api', require('./routes'))

app.listen(port)

console.log(`App is running on port ${port} in ${process.env.NODE_ENV} mode`)