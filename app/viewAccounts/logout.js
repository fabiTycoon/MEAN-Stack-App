'use strict';

angular.module('myApp.logOut', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/logout', {
    templateUrl: 'viewAccounts/logout.html',
    controller: 'logoutCtrl'
  });
}])

.controller('logoutCtrl', [ '$scope', '$rootScope', '$http', 'User', function($scope, $rootScope, $http, User) {

    alert("FUCK YOU");

  console.log("HIT LOGOUT CONTROLLER: ", $rootScope.user);

  if ($rootScope.user && $rootScope.user.username.length !== 0) {

      console.log("IN IF BLOCK OF LOGOUTCTRL")

    User.logOut()
      .then(function(res){
        $rootScope.user = {};
        $location.path('#/')
        console.log("LOGGED OUT: ", $rootScope.user);
      });
  };

}]);