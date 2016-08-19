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

  var formatDateString = function (dateString) {

    if (!dateString) {return;}

      console.log("INPUT STRING:", dateString);

    var formattedDateString = '';
    dateString = dateString + '';
    var year = dateString.slice(0, 4);
      console.log("YEAR: ", year)
    var month = dateString.slice(5, 7);
    month += "/"
      console.log("MONTH: ", month);
    var day = dateString.slice(8, 10);
      console.log("DAY: ", day);
    formattedDateString = month + day + "/" + year;
    return formattedDateString;
  };

  var init = function () {
    //FORMAT DATA FOR DISPLAY:
    if ($rootScope.user && $rootScope.user.reservations.length > 0) {
      for (var i = 0; i < $rootScope.user.reservations.length; i++) {
        var currentReservation = $rootScope.user.reservations[i];
        var petString = currentReservation.pets[0].name;

        if (currentReservation.pets.length > 1) {
          (petString += " & ");
          if (currentReservation.pets.length !==2) {
            var number = currentReservation.pets.length - 1;
            number += "";
            petString = petString + " " + number + " other pets"
          } else {
            petString += " 1 other pet";
          };
        };
        currentReservation.displayPetString = petString
        currentReservation.displayCheckInDate = formatDateString(currentReservation.checkInDate);
        currentReservation.displayCheckOutDate = formatDateString(currentReservation.checkOutDate);
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