'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngMessages',
  'myApp.view1',
  'myApp.view2',
  'myApp.mainView',
  'myApp.bookingView',
  'myApp.version',
  'ngMessages',
  'ngMaterial'
]).
config(['$routeProvider', function($routeProvider) {

  $routeProvider.otherwise({redirectTo: '/main'});
  //add additional routes

}]);
