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
    //UPDATE DB WITH LAST LOGIN TIME (IF MONGOOSE DOESNT DO THIS FOR ME?)
    if ($scope.loginUser.username.length > 3 && $scope.loginUser.password.length > 7) {
      User.logIn($scope.loginUser)
      .then(function(res){


        console.log("LOGGED IN:", res.body);

        if (res.body.success === false) {

          console.log("HEY ITS ACTUALLY WORKGING")

          if (res.body.message.length > 0 ) {
            $rootScope.registrationError = res.body.message            
          } else {
            $rootScope.registrationError = "Invalid username or password";
            $rootScope.$broadcast('registrationError');   
          };
        };

        //$scope.loginLoading = false;

        if (res.status === 401) {
          $rootScope.registrationError = "Invalid username or password";
          $rootScope.$broadcast('registrationError');   
        };

        if (res.data.isLoggedIn === true) {
          $rootScope.user = res.data.user; 
            console.log("LOGGED IN: ", $rootScope.user);
          $location.path('/account')      
        } else if (res.data.isLoggedIn === false) {
          $rootScope.registrationError = res.error;
          console.log("INVALID USERNAME OR PASSWORD:", res.data);
        };
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
    return;
  };

}]);