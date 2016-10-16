'use strict';

(function() {
  angular
    .module('app', [
      'app.features',
      'ngAnimate',
      'app.core',
      'app.services',
      'app.dataservices',
      'app.components',
      'ngResource'
    ])
})()
'use strict';

(function() {
  angular
    .module('app.components', [])
})()
'use strict';

(function() {
  angular
    .module('app.core', [
      'ui.router'
    ])
})()
'use strict';

(function() {
  angular
    .module('app.core')
    .factory('responseInterceptor', responseInterceptor)
    .config(httpProviderConfig)

  responseInterceptor.$inject = ['$q', '$rootScope', '$injector', 'ErrorService']
  function responseInterceptor($q, $rootScope, $injector, ErrorService){
    return {
      responseError: function(response) {
        if(response.status === 404) {
          $rootScope.loading = false
          ErrorService.setError('Not Found', 'There was an error when trying to process your request. Please try again')
        }
        return $q.reject(response)
      }
    }
  }

  httpProviderConfig.$inject = ['$httpProvider']
  function httpProviderConfig($httpProvider){
    $httpProvider.interceptors.push('responseInterceptor')
  }
})()
'use strict';

(function() {
  angular
    .module('app.core')
    .config(routerConfig)

  routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routerConfig($stateProvider, $urlRouterProvider){
    $stateProvider.state('tracker', {
      url: '/',
      templateUrl: 'client/app/features/incidentTracker/incident-tracker.html',
      controller: 'IncidentTrackerController',
      controllerAs: 'vm'
    })
    $urlRouterProvider.otherwise('/');
  }
})()
'use strict';

(function() {
  angular
    .module('app.dataservices', [
      'app.trackerService'
    ])
})()
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
'use strict';

(function() {
  angular
    .module('app.features', [
      'app.tracker'
    ])
})()
'use strict';

(function() {
  angular
    .module('app.errorService', [])
    .factory('ErrorService', ErrorService)

  function ErrorService() {
    var error,
      service = {
        getError: getError,
        setError: setError,
        hasError: hasError
      }
    return service

    function getError() {
      return error
    }

    function setError(userTitle, userMessage) {
      error = [userTitle, userMessage]
    }

    function hasError() {
      return error.length > 0
    }
  }
})()
'use strict';

(function() {
  angular
    .module('app.services', [
      'app.errorService'
    ])
})()
'use strict';

(function() {
  angular
    .module('app.components')
    .directive('errorDialogue', errorDialogue)

  errorDialogue.$inject = ['ErrorService']
  function errorDialogue(ErrorService) {
    var directive = {
      templateUrl: 'client/app/components/errorDialogue/error-dialogue.html',
      restrict: 'E',
      link: function (scope, elem, attrs) {
        elem.bind('click', function() {
          scope.hasError = false
          scope.$apply()
        })
        scope.$watch(ErrorService.getError, function (newVal, oldVal) {
          if (newVal != oldVal) {
            scope.userTitle = newVal[0]
            scope.userMessage = newVal[1]
            scope.hasError = ErrorService.hasError()
          }
        })
      }
    }
    return directive
  }
})()
'use strict';

(function() {
  angular
    .module('app.components')
    .directive('primaryButton', primaryButton)

  function primaryButton() {
    var directive = {
      templateUrl: 'client/app/components/primaryButton/primary-button.html',
      restrict: 'E'
    }
    return directive
  }
})()
'use strict';

(function() {
  angular
    .module('app.tracker', [])
    .controller('IncidentTrackerController', IncidentTrackerController)

  IncidentTrackerController.$inject = ['$http', '$rootScope', 'ErrorService', '$timeout', 'trackerService']
  function IncidentTrackerController($http, $rootScope, ErrorService, $timeout, trackerService) {
    var vm = this
    vm.incidents
    vm.getIncidents = getIncidents
    vm.getGeo = getGeo
    vm.showControls = true
    $rootScope.showControls = showControls

    const map = new GMaps({
      disableDefaultUI: true,
      el: '.map',
      lat: -12.043333,
      lng: -77.028333
    })
    const mapEl = document.querySelector('.map')

    function getIncidents() {
      $rootScope.loading = true
      trackerService.getIncidents(vm.location).then(function(incidents) {
        $rootScope.loading = false
        mapEl.style.filter = 'blur(0px)'
        vm.showControls = false
        vm.incidents = incidents
        $rootScope.accidentCount = incidents.estimatedTotal
        $rootScope.loading = false
        $rootScope.showResults = true
        $rootScope.transition = false
        $rootScope.showButton = true
        const map = new GMaps({
          disableDefaultUI: true,
          el: '.map',
          lat: vm.incidents.resources[0].point.coordinates[0],
          lng: vm.incidents.resources[0].point.coordinates[1]
        })
        vm.incidents.resources.map(function(a, b) {
          vm.chosenOne = {}
          map.addMarker({
            lat: a.point.coordinates[0],
            lng: a.point.coordinates[1],
            title: a.description,
            click: function(e) {
              switch(a.severity) {
              case 1:
                vm.chosenOne.severity = 'Low Impact'
                break
              case 2:
                vm.chosenOne.severity = 'Minor'
                break
              case 3:
                vm.chosenOne.severity = 'Moderate'
                break
              case 4:
                vm.chosenOne.severity = 'Serious'
                break
              }
              switch(a.type) {
              case 1:
                vm.chosenOne.type = 'Accident'
                break
              case 2:
                vm.chosenOne.type = 'Congestion'
                break
              case 3:
                vm.chosenOne.type = 'DisabledVehicle'
                break
              case 4:
                vm.chosenOne.type = 'MassTransit'
                break
              case 5:
                vm.chosenOne.type = 'Miscellaneous'
                break
              case 6:
                vm.chosenOne.type = 'OtherNews'
                break
              case 7:
                vm.chosenOne.type = 'PlannedEvent'
                break
              case 8:
                vm.chosenOne.type = 'RoadHazard'
                break
              case 9:
                vm.chosenOne.type = 'Construction'
                break
              case 10:
                vm.chosenOne.type = 'Alert'
                break
              case 11:
                vm.chosenOne.type = 'Weather'
                break
              }
              vm.chosenOne.roadClosed = a.roadClosed
              vm.chosenOne.title = e.title.split('- ').shift()
              vm.chosenOne.reason = e.title.split('- ').pop()
              vm.chosenOne.roadClosed = a.roadClosed
              $rootScope.showResults = false
              $rootScope.transition = true
              $timeout(function() {
                $rootScope.showResults = true
              },1)
              $rootScope.$apply()
            }
          })
        })
      })
    }

    function showControls() {
      const mapEl = document.querySelector('.map')
      if(vm.showControls) {
        vm.showControls = true
        $rootScope.showButton = false
        mapEl.style.filter = 'blur(0)'
      } else {
        vm.showControls = true
        $rootScope.showButton = false
        mapEl.style.filter = 'blur(20px)'
      }
    }

    function getGeo() {
      $rootScope.loading = true
      GMaps.geolocate({
        success: function(position) {
          map.setCenter(position.coords.latitude, position.coords.longitude)
          var longLat = position.coords.latitude + ',' + position.coords.longitude.toString()
          trackerService.getGeo(longLat).then(function(locationName) {
            vm.location = `${locationName.resources[0].address.adminDistrict} , ${locationName.resources[0].address.countryRegion}`
            $rootScope.loading = false
          })
        },
        error: function(error) {
          ErrorService.setError('Geolocation Denied', 'Your devices location services are disabled')
          $rootScope.loading = false
          $rootScope.$apply()
        },
        not_supported: function() {
          ErrorService.setError('Browser Not Supported', 'It looks like your browser does not support geolocation')
          $rootScope.loading = false
          $rootScope.$apply()
        }
      })
    }
  }
})()