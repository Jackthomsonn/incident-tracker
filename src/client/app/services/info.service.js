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