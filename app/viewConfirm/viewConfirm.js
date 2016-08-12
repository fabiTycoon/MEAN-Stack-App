'use strict';

angular.module('myApp.viewConfirm', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewConfirm', {
    templateUrl: 'viewConfirm/viewConfirm.html',
    controller: 'confirmCtrl'
  });
}])

.controller('confirmCtrl', [function() {

}]);