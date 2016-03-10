'use strict';

angular.module('myApp.viewLogin', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'viewAccounts/login.html',
    controller: 'viewLoginCtrl'
  });
}])

.controller('viewLoginCtrl', [ '$scope', '$http', function($scope, $http) {

  $scope.loginError = false;
  $scope.loginErrorMessage = '';

  $scope.user = {
    username: '',
    password: ''
  };

  $scope.logIn = function (user) {
    return $http.post('/login', user);
  };

  $scope.logOut = function (user) {
    return $http.post('/logout', user.username);
  };

}]);