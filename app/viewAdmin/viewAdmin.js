'use strict';

angular.module('myApp.viewAdmin', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin', {
    templateUrl: 'viewAdmin/admin.html',
    controller: 'viewAdminCtrl'
  });
}])

.controller('viewAdminCtrl', [ '$scope', '$rootScope', '$http', '$location', 'User', function($scope, $rootScope, $http, $location, User) {

  $scope.newMessageCount = $scope.newMessageCount || 0;
  $scope.users = $scope.users || [];
  $scope.reservations = $scope.reservations || [];

  $scope.displayPhone = '';


  var getUsers = function () {

    User.getUsers($rootScope.user)
      .then(function(res){

        if (res.data.success === true) {
          $scope.users = res.data.users;
        } else {
          $scope.errorMessage = res.data.err;
        };



      });
  };

  var getReservations = function () {

  };




  var init = function () {

    if ($rootScope.user && $rootScope.user.phone.length > 0) {
      var phoneString = $rootScope.user.phone;
      var phoneArea = phoneString.slice(0, 3);
      var ph1 = phoneString.slice(3, 6);
      var ph2 = phoneString.slice(6, 10);
      $scope.displayPhone = "(" + phoneArea + ") " + ph1 + " - " + ph2;
        console.log("SET DISPLAY PHONE: ", $scope.displayPhone);
    };

    $scope.errorMessage = '';
    //Pull all reservations from DB
    //ADD NEW TAGS TO ALL THAT HAVENT BEEN SEEN BEFORE 

    getUsers();

    if ($scope.errorMessage !== '') {
      return;      
    };

    getReservations();

    var today = Date.now();
    //var compareDate = $rootScope.user.lastLoggedIn



  };

  if ($rootScope.user && $rootScope.user.admin === true) {
    init();  
  } else {
    $location.path('/');
  };

  
}]);