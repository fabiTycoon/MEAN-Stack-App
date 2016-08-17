'use strict';

angular.module('myApp.viewAccount', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/account', {
    templateUrl: 'viewAccounts/account.html',
    controller: 'viewAccountCtrl'
  });
}])

.controller('viewAccountCtrl', [ '$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

  $scope.displayName = '';
  $scope.profileTitle = 'MY ACCOUNT';

  $scope.accountViewModelState = {
    userInfo: true,
    petInfo: false,
    reservationInfo: false
  };

  if ($rootScope.user) {
    $scope.displayName = $rootScope.user.first + " " + $rootScope.user.last;
    console.log("SET DISPLAY NAME: ", $scope.displayName);
  };

  $scope.setDefaultState = function (reset) {
    for (var state in $scope.accountViewModelState) {
      $scope.accountViewModelState[state] = false;
    };

    if (arguments.length !== 0) {
      $scope.accountViewModelState.userInfo = true;
    };
  };

  $scope.setDefaultState(true);


  $scope.showUserInfo = function () {
    $scope.profileTitle = "MY ACCOUNT:";
    $scope.setDefaultState(true);
  };


  $scope.showProfilePets = function () {
    $scope.setDefaultState();
    $scope.profileTitle = "MY SAVED PETS:";
    $scope.accountViewModelState.petInfo = true;
  };


  $scope.showProfileReservations = function () {
    $scope.setDefaultState();
    $scope.profileTitle = "MY RESERVATIONS:";
    $scope.accountViewModelState.reservationInfo = true;
  };

  var init = function () {
    if ($rootScope.user && $rootScope.user.reservations.length > 0) {
      for (var i = 0; i < $rootScope.user.reservations.length; i++) {
        var petString = $rootScope.user.reservations[i].pets[0].name;
          console.log("FOUND FIRST PET: ", petString);

        if ($rootScope.user.reservations[i].pets.length > 1) {
          petString += " & " + $rootScope.user.reservations[i].pets.length - 1 + " other pets.";
          $rootScope.user.reservations[i].petString = petString
        };
        
          console.log("ADDED PETSTRING: ", petString);
      };
    };

    $(document).ready(function(){
      console.log("CALLED")
       $('.collapsible').collapsible({
         accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
       });
     });
  };

  init();
}]);