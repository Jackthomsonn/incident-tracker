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