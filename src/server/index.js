const express = require('express')
const app = express()
const port = process.env.PORT || 5001

app.use(express.static('dist'))

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept')
  next()
})

app.listen(port)

console.log(`App is running on port ${port} in ${process.env.NODE_ENV} mode`)