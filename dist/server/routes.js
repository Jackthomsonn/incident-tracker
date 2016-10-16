const express = require('express')
const router = express.Router()
const trackerController = require('./routes/tracker')

router.route('/location/:location')
  .get(trackerController.getIncidents)

router.route('/geo/:geo')
  .get(trackerController.getGeoLocation)

module.exports = router