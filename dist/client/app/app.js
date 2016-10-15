'use strict';

(function() {
  angular
    .module('app', [
      'app.features',
      'app.core',
      'app.services',
      'app.components',
      'ngResource'
    ])
})()
'use strict';

(function() {
  angular
    .module('app.components', [
      'app.error'
    ])
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
    .config(httpProviderConfig);

  responseInterceptor.$inject = ['$q', '$rootScope', '$injector', 'ErrorService'];
  function responseInterceptor($q, $rootScope, $injector, ErrorService){
    return {
      responseError: function(response) {
        if(response.status === 401) {
          $rootScope.loading = false;
          var userTitle = JSON.stringify(response.data.userTitle).replace(/\"/g, "");
          var userMessage = JSON.stringify(response.data.userMessage).replace(/\"/g, "");
          ErrorService.setError(userTitle, userMessage);
        }
        if(response.status === 500) {
          $rootScope.loading = false;
          var userTitle = JSON.stringify(response.data.userTitle).replace(/\"/g, "");
          var userMessage = JSON.stringify(response.data.userMessage).replace(/\"/g, "");
          ErrorService.setError(userTitle, userMessage);
        }
        return $q.reject(response);
      }
    };
  }

  httpProviderConfig.$inject = ['$httpProvider'];
  function httpProviderConfig($httpProvider){
    $httpProvider.interceptors.push('responseInterceptor');
  }
})();
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
  }
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
    .module('app.infoService', [])
    .factory('infoService', infoService)

  function infoService() {
    var info,
      service = {
        setInfo: setInfo,
        getInfo: getInfo
      }
    return service

    function setInfo(message) {
      info = message
    }

    function getInfo() {
      return info
    }
  }
})()
'use strict';

(function() {
  angular
    .module('app.services', [
      'app.errorService',
      'app.infoService'
    ])
})()
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
    .module('app.error', [])
    .directive('errorDialogue', errorDialogue)

  errorDialogue.$inject = ['ErrorService'];
  function errorDialogue(ErrorService) {
    var directive = {
      templateUrl: 'client/app/components/errorDialogue/error-dialogue.html',
      restrict: 'E',
      link: function (scope, elem, attrs) {
        elem.bind('click', function() {
          scope.hasError = false;
          scope.$apply();
        });
        scope.$watch(ErrorService.getError, function (newVal, oldVal) {
          if (newVal != oldVal) {
            scope.userTitle = newVal[0];
            scope.userMessage = newVal[1];
            scope.hasError = ErrorService.hasError();
          }
        });
      }
    }
    return directive
  }
})()
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