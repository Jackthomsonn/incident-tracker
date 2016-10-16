'use strict';

angular
  .module('app.trackerService', [])
  .factory('trackerService', trackerService)

trackerService.$inject = ['$resource']
function trackerService($resource) {
  var service = {
    getIncidents: getIncidents,
    getGeo: getGeo,
    locationResource: $resource('api/location/:location'),
    geoResource: $resource('api/geo/:geo')
  }

  return service

  function getIncidents(location) {
    return this.locationResource.get({location: location}).$promise.then(function(data) {
      return data
    })
  }

  function getGeo(locationName) {
    return this.geoResource.get({geo: locationName}).$promise.then(function(data) {
      return data
    })
  }
}