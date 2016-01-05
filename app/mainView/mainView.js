'use strict';

angular.module('myApp.mainView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'mainView/mainView.html',
    controller: 'MainViewCtrl'
  });
}])

.controller('MainViewCtrl', [function() {
  
}]);