'use strict';

angular.module('myApp.viewAccount', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/account', {
    templateUrl: 'viewAccounts/account.html',
    controller: 'viewAccountCtrl'
  });
}])

.controller('viewAccountCtrl', [ '$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

  $scope.accountViewModelState = {
    userInfo: true,
    petInfo: false,
    reservationInfo: false
  };

  $scope.setDefaultState = function (reset) {

    for (var state in $scope.accountViewModelState) {
      $scope.accountViewModelState[state] = false;
    };

    if (arguments.length !== 0) {
      $scope.accountViewModelState.petInfo = true;
    };


  };

  $scope.showUserInfo = function () {
    $scope.setDefaultState();
    $scope.profileTitle = "MY ACCOUNT:";
    $scope.accountViewModelState.userInfo = true;
  };
  
  $scope.showProfilePets = function () {
    $scope.setDefaultState();
    $scope.profileTitle = "MY SAVED PETS:";
    $scope.accountViewModelState.petInfo = true;
  };

  $scope.showProfileReservations = function () {
    $scope.setDefaultState();
    $scope.profileTitle = "MY RESERVATIONS";
    $scope.accountViewModelState.reservationInfo = true;
  };




}]);