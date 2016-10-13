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
  $scope.petData = $scope.petData || {};  
  $scope.editedPet = $scope.editedPet || {};  

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

      };
    };

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

    $scope.editSuccessMessage = "Succesfully updated your information.";

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

  $scope.cancelEditPet = function () {
    for (var key in $scope.petData) {
      $scope.petData[key] = '';
    };
    $scope.showProfilePets();
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

  $scope.showEditPetField = function (editedPetField, editedPet) {
     $scope.setDefaultState(); 
     $scope.accountViewModelState.editingPet = true;
     $scope.accountViewModelState.petInfo = true;


          console.log("CALLED SHOW EDIT PET FIELD: ", editedPetField, editedPet);

     //animate transition:
     $('#edit-container').addClass('animated flipOutY');
     $scope.refresh = true;
     $scope.refresh = false;
     $('#edit-container').removeClass('animated flipOutY');

     $scope.petData._id = editedPet;
     
     //UPDATE THESE - NOT YET VERIFIED AS WORKING:
     if (editedPetField === 'weight') {
        $scope.displayName = 'EDIT MY PET\'S WEIGHT:';
        $scope.accountViewModelState.petField = 'weight-fields';
        $scope.petData.fieldToUpdate = 'weight';
     } else if (editedPetField === 'breed') {
      $scope.displayName = 'EDIT MY PET\'S BREED:';
      $scope.accountViewModelState.petField = 'breed-fields';
      $scope.petData.fieldToUpdate = 'breed';
     } else if (editedPetField === 'color') {
      $scope.displayName = 'EDIT MY PET\'S COLOR:';
      $scope.accountViewModelState.petField = 'color-fields';
      $scope.petData.fieldToUpdate = 'color';
     } else if (editedPetField === 'name') {
      $scope.displayName = 'EDIT MY PET\'S NAME:';
       $scope.accountViewModelState.petField = 'name-fields';
       $scope.petData.fieldToUpdate = 'name';
     } else if (editedPetField === 'age') {
       $scope.displayName = 'EDIT MY PET\'S AGE:';
       $scope.accountViewModelState.petField = 'age-fields';
       $scope.petData.fieldToUpdate = 'age';
      } else if (editedPetField === 'food-brand' || editedPetField === 'food-servings' || editedPetField === 'food-allergies') {
        $scope.displayName = 'EDIT MY PET\'S FOOD INFO:';
        $scope.accountViewModelState.petField = 'food-fields';
        $scope.petData.fieldToUpdate = 'food';
      } else if (editedPetField === 'comments') {
        $scope.displayName = 'ADD ADDITIONAL COMMENTS:';
        $scope.accountViewModelState.petField = 'comments-fields';
        $scope.petData.fieldToUpdate = 'comments';
      };
  };

  $scope.validatePet = function (petData) {
    //VALIDATES PET BEFORE SENDING TO SERVER:
        //$scope.savingUser = true - triggers loading state
        $rootScope.registrationError = '';
        var fieldToUpdate = petData.fieldToUpdate;
        $scope.editSuccessMessage = "Succesfully updated your pet's information!";

          console.log("CALLED VALIDATE PET, VALIDATING THIS: ", petData);
          console.log("CALLED VALIDATE PET, UPDATING THIS FIELD: ", fieldToUpdate);
             
         if (fieldToUpdate === 'age') {  

            var petAge = Number(petData.age);
              console.log("PET AGE TYPE NUMBER: ", petAge);

           if (!petAge) {  //NEED TO VERIFY THAT THIS VALIDATES SUFFICIENTLY?
             $rootScope.registrationError = 'Please enter a valid age for your pet';
             $rootScope.$broadcast('registrationError');
             return;
           };
           $scope.editSuccessMessage = "Succesfully updated your pet's age!";
         } else if (fieldToUpdate === 'weight') {
           if (petData.weight.length >= 4) {
            $rootScope.registrationError = 'Woops! That seems awfully heavy for a house pet!';
            $rootScope.$broadcast('registrationError');
            return;
           };
           $scope.editSuccessMessage = "Succesfully updated your pet's weight!";
         };

         $scope.petData = petData;

          console.log("CALLING CONFIRM EDIT PET, END OF VALIDATE FN: ", $scope.petData);
        $scope.confirmEditPet();
  };

  $scope.validateUser = function (userData) {
    //VALIDATES USER BEFORE SENDING TO SERVER:
    //$scope.savingUser = true - triggers loading state

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
      console.log("UPDATING USER (rootScope): ", $rootScope.user); 
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

  $scope.confirmEditPet = function () {

    var petData = $scope.petData;

      console.log("CALLING confirmEditPet:", petData);

    

    User.editPet(petData)
      .then(function(res){

        if (res) {console.log("EDIT USER SERVER RESPONSE: ", res.data);};
        
        if (res.data.success === true) {
          var returnedPet = res.data.pet; 
          
          //ADD PET TO USER:
          for (var i = 0; i < $rootScope.user.pets.length; i++) {
            if ($rootScope.user.pets[i]._id === returnedPet._id) {
              $rootScope.user.pets[i] = returnedPet;
              console.log("SET RETURNED PET OBJECT ON USER: ", returnedPet);
              console.log("SET RETURNED PET OBJECT ON USER: ", $rootScope.user);
            };
          };

          //SAVE UPDATED USER INSTANCE:
          User.addPetToUser($rootScope.user)
            .then(function(res){
              if (res.data.success === true) {
                //$rootScope.user = res.data.updatedUser;
                  console.log("SAVED PET BACK TO USER: ", $rootScope.user);
              } else {
                $rootScope.registrationError = "There was an error saving your data.  Please try again.";
                $rootScope.$broadcast('registrationError');
              };
            });

          console.log("UPDATED PET: ", returnedPet);
            $scope.setDefaultState();
            $scope.accountViewModelState.petInfo = true;

            for (var key in $scope.petData) {
              $scope.petData[key] = '';
            };

            $timeout(function(){
              Materialize.toast($scope.editSuccessMessage, 4000);
            }, 200);

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

        console.log("PETS BE LIKE: ", $rootScope.user.pets)

    $scope.accountViewModelState.petInfo = true;
  };


  $scope.showProfileReservations = function () {
    $scope.setDefaultState();
    $scope.displayTitle = "MY RESERVATIONS";
    $('ul.tabs').tabs('select_tab', 'reservations-tab');
    $scope.profileTitle = "MY RESERVATIONS:";
    $scope.accountViewModelState.reservationInfo = true;
      console.log("VM STATE: ", $scope.accountViewModelState);
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