'use strict';

angular.module('myApp.viewAccount', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/account', {
    templateUrl: 'viewAccounts/account.html',
    controller: 'viewAccountCtrl'
  });
}])

.controller('viewAccountCtrl', [ '$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {

  $scope.displayName = '';
  $scope.displayPhone = '';
  $scope.profileTitle = 'MY ACCOUNT';
  $rootScope.registrationError = '';
  $scope.refresh = false;
  $scope.editUserTitle = '';

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
      userField: '', //accepts: 'contact-fields', 'address-fields', 'medical-fields', ''
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
    for (var userField in $scope.userData) {
      $scope.userData[userField] = '';
    };

    $scope.setDefaultState(true);
  };

  $scope.phoneConcat = function () {
    var area = '',
     ph1 = '',
     ph2 = '';

     area += $scope.userData.area;
     ph1 += $scope.userData.ph1;
     ph2 += $scope.userData.ph2;

    $scope.userData.phone = area + ph1 + ph2;
  };

  $scope.showEditUserField = function (editedUserField) {
     $scope.setDefaultState(); 
     $scope.accountViewModelState.editingUser = true;
     
     if (editedUserField === 'email' || editedUserField === 'phone') {
      $scope.displayName = 'EDIT MY CONTACT INFO:';
      $scope.accountViewModelState.userField = 'contact-fields';
     } else if (editedUserField === 'address' || editedUserField === 'city' || editedUserField === 'state' || editedUserField === 'zip') {
      $scope.displayName = 'EDIT MY ADDRESS INFO:';
      $scope.accountViewModelState.userField = 'address-fields';
     } else if (editedUserField === 'hospital') {
      $scope.displayName = 'EDIT MY MEDICAL PROVIDER INFORMATION:';
      $scope.accountViewModelState.userField = 'medical-fields';
     } else if (editedUserField === 'password') {
      $scope.displayName = 'UPDATE MY PASSWORD:';
      $scope.accountViewModelState.userField = 'password-fields';
     };
  };

  $scope.validateUser = function () {

     //VALIDATION RULES
     if ($scope.accountViewModelState.userField === 'contact-fields') { 

      $scope.phoneConcat();
      
       if ($scope.userData.email.length > 0) {
         if ($scope.userData.email.length < 3 || $scope.userData.email.indexOf('.') === -1 || $scope.userData.email.indexOf('@') === -1) {
           $rootScope.registrationError = 'Please enter a valid e-mail address'.
           $rootScope.broadcast('registrationError');
           return;
         };
       };

       if ($scope.userData.phone.length > 0 && $scope.userData.phone.length !== 10) {
        $rootScope.registrationError = 'Please enter a valid phone number'.
        $rootScope.broadcast('registrationError');
        return;
       };
      } else if ($scope.accountViewModelState.userField === 'address-fields') {

        if ($scope.userField.address.length > 0 && $scope.userField.address.length < 4) {
          $rootScope.registrationError = 'Please enter a valid street address'.
          $rootScope.broadcast('registrationError');
          return;
        } else if ($scope.userField.city.length > 0 && $scope.userField.city.length < 3) {
          $rootScope.registrationError = 'Please enter a valid city or town'.
          $rootScope.broadcast('registrationError');
          return;
        } /*else if ($scope.userField.state.length > 0) {
          //FIGURE OUT HOW TO DO THIS
        }*/
          else if ($scope.userField.zip.length > 0 && $scope.userField.zip.length !== 5) {
            $rootScope.registrationError = 'Please enter a valid zip code'.
            $rootScope.broadcast('registrationError');
            return;
          };
      } else if ($scope.accountViewModelState.userField === 'hospital-field') {
        return;
      };
    $scope.confirmEditUser();
  };

  $scope.confirmEditUser = function () {
    var updatedData = $scope.userData;
    console.log("UPDATING USER WITH THIS DATA: ", $scope.userData); 
    //TO DO: DATA VALIDATION

    var updateCount = 0;

    for (var key in updatedData) {

      if (updatedData[key] === '' && $rootScope.user[key]) {
        updateCount++;
        updatedData[key] = $rootScope.user[key];
      };
      console.log("SET THIS VALUE ", key, updatedData);
    };

    if (updateCount === 0) {
      $rootScope.registrationError = "Please update any and all fields ";
      $rootScope.$broadcast('registrationError');
    };

    User.editUser(updatedData)
      .then(function(res){

        if (res.data.success === true) {
          var returnedUser = res.data.user; 
            console.log("UPDATED USER: ", returnedUser);

            $scope.setDefaultState();
            $scope.accountViewModelState.editingUser = true;
        } else {
          $rootScope.registrationError = res.data.err;
          $rootScope.$broadcast('registrationError');
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
  $rootScope.$on('registrationError', function(){
      console.log("ERROR:", $rootScope.registrationError);
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