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
  $scope.displayPhone = '';
  $scope.profileTitle = 'MY ACCOUNT';
  $rootScope.accountError = ''
  $scope.refresh = false;

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

  $scope.accountViewModelState = {
    userInfo: true,
    petInfo: false,
    reservationInfo: false,
    editingUser: false,
    editingPet: false,
  };

  if ($rootScope.user) {
    $scope.displayName = $rootScope.user.first + " " + $rootScope.user.last;
    console.log("SET DISPLAY NAME: ", $scope.displayName);
  };

  $scope.refreshView = function () {
    $scope.refresh = true;
    $scope.refresh = false;
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

  $scope.cancelEdit = function () {
    $scope.setDefaultState();
  };

  $scope.showEditUser = function () {
     $scope.setDefaultState(); 
     $scope.accountViewModelState.editingUser = true;
  };

  $scope.editUser = function () {
    var updatedData = $scope.userData;
    console.log("UPDATING USER WITH THIS DATA: ", $scope.userData); 
    //TO DO: DATA VALIDATION

    for (var key in updatedData) {

      if (updatedData[key] === '' && $rootScope.user[key]) {
        updatedData[key] = $rootScope.user[key];
      };
      console.log("SET THIS VALUE ", key, updatedData);
    };

    User.editUser(updatedData)
      .then(function(res){

        if (res.data.success === true) {
          var returnedUser = res.data.user; 
            console.log("UPDATED USER: ", returnedUser);
        } else {
          $rootScope.accountError = ''
          $rootScope.$broadcast('accountError');
        };  
      });


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

  $scope.showEditPet = function () {
    $scope.setDefaultState(); 
    $scope.accountViewModelState.editingPet = true;
  };

  $scope.editPet = function () {

  };

  var formatDateString = function (dateString) {
    if (!dateString) {return;}
    var formattedDateString = '';
    dateString = dateString + '';
    var year = dateString.slice(0, 4);
    var month = dateString.slice(5, 7);
    month += "/"
    var day = dateString.slice(8, 10);
    formattedDateString = month + day + "/" + year;
    return formattedDateString;
  };

  //ERROR HANDLER:
  $rootScope.$on('accountError', function(){
      console.log("ERROR:", $rootScope.accountError);
    $('#account-form-container').addClass('animated shake')
    $scope.refreshView()
    $timeout(function(){
      $('#account-form-container').removeClass('animated shake');
    }, 1500);
  });

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