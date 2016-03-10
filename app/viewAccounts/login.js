'use strict';

angular.module('myApp.viewLogin', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'viewAccounts/login.html',
    controller: 'viewLoginCtrl'
  });
}])

.controller('viewLoginCtrl', [ '$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

  $scope.refresh = false;
  $scope.loginError = false;
  $scope.loginErrorMessage = '';

  $scope.user = {
    username: '',
    password: ''
  };

  $scope.$on('login-error', function() {
    $('#login-form-container').addClass('animated shake')
    $scope.refresh = true;
    $scope.refresh = false; 
  });

  $scope.logIn = function () {
    return $http.post('api/users/login', $scope.user)
      .then(function successCallback(req, res){
        console.log("req is:", req)
        console.log("resp is:", res)
        //$scope.loginError = res.data.message;
        $rootScope.$broadcast('login-error');
      }), function errorCallback(res) {
        console.log("error, res is:", res);
        // TO DO: additional error handling
      }
  };

  $scope.logOut = function (user) {
    return $http.post('api/users/logout', $scope.user.username);
  };

}]);