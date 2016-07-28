'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngMessages',
  'myApp.viewAbout',
  'myApp.viewGallery',
  'myApp.viewMain',
  'myApp.viewAddUser',
  'myApp.viewAddBooking',
  'myApp.addPetView',
  'myApp.viewLogin',
  'myApp.version',
  //'myApp.basicServices',
  'myApp.directivesModule',
  'ngMessages',
  'ngSanitize',
]).
config(['$routeProvider', function($routeProvider) {

  $routeProvider.otherwise({redirectTo: '/main'});
  //add additional routes

}]);
