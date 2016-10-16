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