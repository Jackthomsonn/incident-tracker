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