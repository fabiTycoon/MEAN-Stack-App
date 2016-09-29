'use strict';

angular.module('myApp.viewLogin', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'viewAccounts/login.html',
    controller: 'viewLoginCtrl'
  });
}])

.controller('viewLoginCtrl', [ '$scope', '$rootScope', '$http', '$location', 'User', function($scope, $rootScope, $http, $location, User) {

  $scope.refresh = false;
  $scope.loginLoading = false;
  $rootScope.signingUp = false;

  $scope.loginUser = {
    username: '',
    password: ''
  };

  $scope.$on('registrationError', function() {
    $('#registration-form-container').addClass('animated shake')
    $scope.refresh = true;
    $scope.refresh = false; 
  });

  $scope.addNewuser = function () {
    $location.path('/book')
    $rootScope.signingUp = true;
  };

  $scope.login = function () {
    //$scope.loginLoading = true;
    $rootScope.registrationError = '';
    //UPDATE DB WITH LAST LOGIN TIME
    if ($scope.loginUser.username.length > 3 && $scope.loginUser.password.length > 7) {
      User.logIn($scope.loginUser)
      .then(function (res) {
        //SUCCESS CALLBACK:
        //$scope.loginLoading = false;
        if (res.data.isLoggedIn === true) {
          $rootScope.user = res.data.user; 
          $location.path('/account')      
        };



      },function (res) {
        //FAILURE CALLBACK
        $rootScope.registrationError = "Please enter a valid username and password";
        $rootScope.$broadcast('registrationError');     
      });
    } else {
      $rootScope.registrationError = "Please enter a valid username and password";
      $rootScope.$broadcast('registrationError');   
    };  
  };

  $scope.goHome = function () {
    $location.path('/');
  };

  $scope.recoverPassword = function () {

    //If e-mail exists, send recovery e-mail with temproary password
    //Set temporary password
    //Send success message
    return;
  };

}]);