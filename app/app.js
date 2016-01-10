'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngMessages',
  'myApp.viewAbout',
  'myApp.viewGallery',
  'myApp.viewMain',
  'myApp.bookingView',
  'myApp.addPetView',
  'myApp.version',
  'ngMessages'
]).
config(['$routeProvider', function($routeProvider) {

  $routeProvider.otherwise({redirectTo: '/main'});
  //add additional routes

}]);
