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