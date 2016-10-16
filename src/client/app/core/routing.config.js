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