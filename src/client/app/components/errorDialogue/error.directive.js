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