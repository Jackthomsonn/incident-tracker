'use strict';

(function() {
  angular
    .module('app.tracker', [])
    .controller('IncidentTrackerController', IncidentTrackerController)

  IncidentTrackerController.$inject = ['$http', '$rootScope', 'ErrorService']
  function IncidentTrackerController($http, $rootScope, ErrorService) {
    var vm = this
    vm.incidents
    vm.location = 'Cardiff, UK'
    vm.getLocation = getLocation
    $rootScope.showControls = showControls
    const map = new GMaps({
      el: '.map',
      lat: -12.043333,
      lng: -77.028333
    })
    const mapEl = document.querySelector('.map')

    activate()

    function activate() {
      vm.showControls = true
    }

    function getLocation() {
      $rootScope.loading = true
      $http({
        method: 'GET',
        url: 'http://dev.virtualearth.net/REST/v1/Locations/'+vm.location+'?key=Amcx-3d4qtTezUQvzS8Lye9XcB9JcwaAqd77Nt_pb3Whpl6CBFBdoYYgo9dnXL-H'
      }).then(function successCallback(location) {
        getIncidents(location);
      }, function errorCallback(response) {
        ErrorService.setError('Error getting data', 'There was an error when trying to process your request please try again later')
        $rootScope.loading = false
      })
    }

    function getIncidents(location) {
      vm.longLat = location.data.resourceSets[0].resources[0].bbox.toString()
      $http({
        method: 'GET',
        url: 'http://dev.virtualearth.net/REST/v1/Traffic/Incidents/'+vm.longLat+'?key=Amcx-3d4qtTezUQvzS8Lye9XcB9JcwaAqd77Nt_pb3Whpl6CBFBdoYYgo9dnXL-H'
      }).then(function successCallback(incidents) {
        mapEl.style.filter = 'blur(0px)'
        vm.showControls = false
        vm.incidents = incidents.data.resourceSets[0]
        $rootScope.accidentCount = incidents.data.resourceSets[0].estimatedTotal
        $rootScope.loading = false
        $rootScope.showResults = true
        const map = new GMaps({
          disableDefaultUI: true,
          el: '.map',
          lat: vm.incidents.resources[0].point.coordinates[0],
          lng: vm.incidents.resources[0].point.coordinates[1]
        })
        vm.incidents.resources.map(function(a, b) {
          map.addMarker({
            lat: a.point.coordinates[0],
            lng: a.point.coordinates[1],
            title: a.description,
            click: function(e) {
              vm.chosenOne = {
                title: e.title.split('- ').shift(),
                reason: e.title.split('- ').pop(),
                severity: a.severity,
                roadClosed: a.roadClosed
              }
              $rootScope.$apply()
            }
          })
        })
      }, function errorCallback(response) {
        ErrorService.setError('Error getting data', 'There was an error when trying to process your request please try again later')
        $rootScope.loading = false
      })
    }

    function showControls() {
      vm.showControls = true
      const mapEl = document.querySelector('.map')
      mapEl.style.filter = 'blur(20px)'
    }
  }
})()