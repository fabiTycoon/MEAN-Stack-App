'use strict';

angular.module('myApp.viewAccount', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/account', {
    templateUrl: 'viewAccounts/account.html',
    controller: 'viewAccountCtrl'
  });
}])

.controller('viewAccountCtrl', [ '$scope', '$rootScope', '$http', '$timeout', 'User', function($scope, $rootScope, $http, $timeout, User) {

  $scope.displayName = '';
  $scope.displayPhone = '';
  $scope.displayTitle = '';
  $rootScope.registrationError = '';
  $scope.refresh = false;
  $scope.editUserTitle = '';
  $scope.updatingUsername = false;
  $scope.editSuccessMessage = "Succesfully updated your information!";

  //IF USER CLICKS EDIT BUTTON, SHOW EDITABLE TEXT AREAS:
  $scope.userData = $scope.userData || {};  

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

    if ($rootScope.user.pets) {
      for (var i = 0; i < $rootScope.user.pets; i++) {

      }
    }

  };

  $scope.refreshView = function () {
    $scope.refresh = true;
    $scope.refresh = false;
  };

  $scope.setDefaultState = function (reset) {
    if ($rootScope.user) {
      $scope.displayName = $rootScope.user.first + " " + $rootScope.user.last;
    };

    for (var state in $scope.accountViewModelState) {
      $scope.accountViewModelState[state] = false;
    };

    if (arguments.length !== 0) {
      $('ul.tabs').tabs('select_tab', 'user-tab');
      $scope.displayTitle = "MY ACCOUNT INFO:";
      $scope.accountViewModelState.userInfo = true;
    };
  };

  $scope.setDefaultState(true);

  $scope.cancelEdit = function () {
    for (var key in $scope.userData) {
      $scope.userData[key] = '';
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
    $scope.userData.phone = (area + ph1 + ph2);
  };

  $scope.showEditUserField = function (editedUserField) {
     $scope.setDefaultState(); 
     $scope.accountViewModelState.editingUser = true;

     //animate transition:
     $('#edit-container').addClass('animated flipOutY');
     $scope.refresh = true;
     $scope.refresh = false;
     $('#edit-container').removeClass('animated flipOutY');
     
     if (editedUserField === 'email') {
        $scope.displayName = 'EDIT MY CONTACT INFO:';
        $scope.accountViewModelState.userField = 'email-fields';
        $scope.userData.fieldToUpdate = 'email';
     } else if (editedUserField === 'phone') {
       $scope.displayName = 'EDIT MY CONTACT INFO:';
       $scope.accountViewModelState.userField = 'phone-fields';
       $scope.userData.fieldToUpdate = 'phone';
      } else if (editedUserField === 'street' || editedUserField === 'city' || editedUserField === 'state' || editedUserField === 'zip') {
        $scope.displayName = 'EDIT MY ADDRESS INFO:';
        $scope.accountViewModelState.userField = 'address-fields';
        $scope.userData.fieldToUpdate = 'address';
      } else if (editedUserField === 'hospital') {
        $scope.displayName = 'EDIT MY MEDICAL PROVIDER INFORMATION:';
        $scope.accountViewModelState.userField = 'medical-fields';
        $scope.userData.fieldToUpdate = 'hospital';
      } else if (editedUserField === 'password') {
        $scope.displayName = 'UPDATE MY PASSWORD:';
        $scope.accountViewModelState.userField = 'password-fields';
        $scope.userData.fieldToUpdate = 'password';
      };
  };

  $scope.validateUser = function (userData) {

    
    //VALIDATES USER BEFORE SENDING TO SERVER:
    //$scope.savingUser = true - triggers loading state

      console.log("ANGULAR ERASES ALL OF MY DATA HERE:", userData);

    $scope.phoneConcat();
    $rootScope.registrationError = '';
    var fieldToUpdate = userData.fieldToUpdate;
    $scope.editSuccessMessage = "Succesfully updated your information!";

      console.log("CALLED VALIDATE USER, VALIDATING THIS: ", userData);
      console.log("CALLED VALIDATE USER, UPDATING THIS FIELD: ", fieldToUpdate);
         
     if (fieldToUpdate === 'email') {  
       if (userData.email.length < 3 || userData.email.indexOf('.') === -1 || userData.email.indexOf('@') === -1) {
         $rootScope.registrationError = 'Please enter a valid e-mail address';
         $rootScope.$broadcast('registrationError');
         return;
       } else if (userData.email !== userData.emailConfirm) {
          $rootScope.registrationError = 'E-mail addresses do not match';
          $rootScope.$broadcast('registrationError');
          return;
       } else {
        $scope.editSuccessMessage = "Succesfully updated your e-mail!";
        userData.username = $scope.userData.email;
       };
     } else if (fieldToUpdate === 'phone') {
       if (userData.phone.length !== 10) {
            console.log("PHONE: ", userData.phone)
        $rootScope.registrationError = 'Please enter a valid phone number';
        $rootScope.$broadcast('registrationError');
        return;
       };
       $scope.editSuccessMessage = "Succesfully updated your phone number!";
     } else if (fieldToUpdate === 'address') {
      if (userData.street.length < 4) {
        $rootScope.registrationError = 'Please enter a valid street userData';
        $rootScope.$broadcast('registrationError');
        return;
      } else if (userData.city.length < 3) {
        $rootScope.registrationError = 'Please enter a valid city or town';
        $rootScope.$broadcast('registrationError');
        return;
      } /*else if (userData.state.length > 0) {
        //FIGURE OUT HOW TO DO THIS
      }*/
        else if (userData.zip.length !== 5) {
          $rootScope.registrationError = 'Please enter a valid zip code';
          $rootScope.$broadcast('registrationError');
          return;
        };
        $scope.editSuccessMessage = "Succesfully updated your address!";
    } else if (fieldToUpdate === 'hospital') {
        if (userData.hospital.length < 3) {
          $rootScope.registrationError = 'Please enter a valid hospital name';
          $rootScope.$broadcast('registrationError');
          return;
        };
        $scope.editSuccessMessage = "Succesfully updated your veterinary info!";
    } else if (fieldToUpdate === 'password') {
      if (userData.password.length < 8) {
        $rootScope.registrationError = 'Password must be at least 8 characters';
        $rootScope.$broadcast('registrationError');
        return;
      } else if (userData.password !== $scope.userData.passwordConfirm) {
        $rootScope.registrationError = 'Passwords do not match';
        $rootScope.$broadcast('registrationError');
        return;
      };
      $scope.editSuccessMessage = "Succesfully updated your password!";
    };
      console.log("CALLING CONFIRM EDIT USER, END OF VALIDATE FN: ", JSON.stringify(userData));
    $scope.confirmEditUser(userData);
  };

  $scope.confirmEditUser = function (userData) {

    if ($rootScope.user) {
      console.log("UPDATING USER (rootscope): ", $rootScope.user); 
      userData.currentUsername = $rootScope.user.email;
      userData.email = $rootScope.user.email;
      userData.username = $rootScope.user.email;
    };

      console.log("CALLING confirmEditUser:", userData);

    User.editUser(userData)
      .then(function(res){
        
        if (res) {console.log("EDIT USER SERVER RESPONSE: ", res.data);};
        
        if (res.data.success === true) {
          var returnedUser = res.data.user; 
          $rootScope.user = returnedUser;
          init();
          console.log("UPDATED USER: ", returnedUser);

            if (res.data.message) {
              console.log("SERVER MESSAGE: ", res.data.message);
            };

            $scope.setDefaultState(true);
            for (var key in $scope.userData) {
              $scope.userData[key] = '';
            };

            $timeout(function(){
              Materialize.toast($scope.editSuccessMessage, 4000);
            }, 500);

        } else {
          $rootScope.registrationError = res.data.err;
          $rootScope.$broadcast('registrationError');
        };  
      });
  };

  $scope.showUserInfo = function () {
    $scope.setDefaultState(true);
    $('ul.tabs').tabs('select_tab', 'user-tab');
  };

  $scope.showProfilePets = function () {
    $scope.setDefaultState();
    $scope.displayTitle = "MY SAVED PETS";
    $('ul.tabs').tabs('select_tab', 'pets-tab');
    $scope.accountViewModelState.petInfo = true;
    $timeout(function(){
      $('.collapsible').collapsible({
        accordion : false
      });
      return;
    }, 200);
  };


  $scope.showProfileReservations = function () {
    $scope.setDefaultState();
    $scope.displayTitle = "MY RESERVATIONS";
    $('ul.tabs').tabs('select_tab', 'reservations-tab');
    $scope.profileTitle = "MY RESERVATIONS:";
    $scope.accountViewModelState.reservationInfo = true;
  };

  $scope.showEditPet = function () {
    $scope.setDefaultState(); 
    $scope.accountViewModelState.editingPet = true;
  };

  $scope.validatePetEdits = function () {



    $scope.confirmPetEdits();
  };

  $scope.confirmPetEdits = function () {

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
    if ($rootScope.user && $rootScope.user.phone && $rootScope.user.phone.length > 0) {
      var phoneString = $rootScope.user.phone;
      var phoneArea = phoneString.slice(0, 3);
      var ph1 = phoneString.slice(3, 6);
      var ph2 = phoneString.slice(6, 10);
      $scope.displayPhone = "(" + phoneArea + ") " + ph1 + " - " + ph2;
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
     $('.collapsible').collapsible({
       accordion : false
     });
   });

  };


  init();
}]);