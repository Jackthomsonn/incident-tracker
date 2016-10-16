const request = require('request')

module.exports.getIncidents = function(req, res) {
  const options = {
    uri: 'https://dev.virtualearth.net/REST/v1/Locations/'+req.params.location+process.env.API_KEY
  }
  request(options,
    function(err, res, location) {
      if(!err && res.statusCode === 200) {
        const responseBody = JSON.parse(location)
        getIncidents(req, res, responseBody)
      }
    }
  )

  function getIncidents(req, res, location) {
    if(location.resourceSets[0].estimatedTotal !== 0) {
      const longLat = location.resourceSets[0].resources[0].bbox.toString()
      const options = {
        uri: 'https://dev.virtualearth.net/REST/v1/Traffic/Incidents/'+longLat+process.env.API_KEY
      }
      request(options,
        function(err, res, incidents) {
          if(!err && res.statusCode === 200) {
            response(incidents)
          } else {
            errorHandler()
          }
        })
    }
  }

  function response(responses) {
    const response = JSON.parse(responses)
    if(response.resourceSets[0].estimatedTotal === 0) {
      errorHandler()
    }
    res.status(200).send(response.resourceSets[0])
  }

  function errorHandler() {
    res.status(404).send()
  }
}

module.exports.getGeoLocation = function(req, res) {
  const options = {
    uri: 'https://dev.virtualearth.net/REST/v1/Locations/'+req.params.geo+process.env.API_KEY
  }
  request(options,
    function(err, res, body) {
      if(!err && res.statusCode === 200) {
        response(body)
      } else {
        errorHandler()
      }
    })

  function response(responses) {
    const response = JSON.parse(responses)
    res.status(200).send(response.resourceSets[0])
  }

  function errorHandler() {
    res.status(404).send()
  }
}