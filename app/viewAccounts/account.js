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

  //IF USER CLICKS EDIT BUTTON, SHOW EDITABLE TEXT AREAS:
  $scope.userData = {
    first: '',
    last: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    hospital: '',
    password: '',
    passwordConfirm: ''
  };

  $scope.displayPhone = '';

  $scope.accountViewModelState = {
    userInfo: true,
    petInfo: false,
    reservationInfo: false,
    editingUser: false
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

  $scope.editUser = function () {
    $scope.setDefaultState(true);
    $scope.accountViewModelState.editingUser = true;
  };

  $scope.cancelEdit = function () {
    $scope.setDefaultState(true);
    $scope.accountViewModelState.editingUser = false;
  };

  $scope.confirmEdit = function () {
    //DATA VALIDATION:
   /*

    User.editUser($scope.userData)
      .then(function (res) {

        if (res.data.success === true) {
  
          //UPDATE LOCAL USER PROPERTIES
          $rootScope.user = 
          //RESET VIEW STATE
        } else {
  
        };
  


      })*/


  };

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

  $scope.editPet = function (petId) {

  };

  $scope.editUser = function () {

    var existingUserObject = $rootScope.user;
        console.log("GRABBED USER DATA: ", existingUserObject);

    var updatedData

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
    if ($rootScope.user && $rootScope.user.phone.length > 0) {
      var phoneString = $rootScope.user.phone;
      var phoneArea = phoneString.slice(0, 3);
      var ph1 = phoneString.slice(3, 6);
      var ph2 = phoneString.slice(6, 10);
      $scope.displayPhone = "(" + phoneArea + ") " + ph1 + " - " + ph2;
        console.log("SET DISPLAY PHONE: ", $scope.displayPhone);
    };

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
         accordion : false
       });
     });
  };

  init();
}]);