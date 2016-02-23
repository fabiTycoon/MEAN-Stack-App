'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'viewAccounts/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', [ '$scope', 'User', function($scope, User) {

  $scope.user = {
    username: '',
    password: ''
  };

  $scope.logIn = function (user) {
    return User.logIn(user);
  };

  $scope.logOut = function () {
    return User.logOut();
  };

}]);