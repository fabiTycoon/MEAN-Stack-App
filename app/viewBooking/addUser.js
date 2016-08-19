'use strict';

angular.module('myApp.viewAddUser', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book', {
    templateUrl: 'viewBooking/addUser.html',
    controller: 'AddUserCtrl',
  });
}])

.controller('AddUserCtrl', ['$scope', '$rootScope', '$timeout', 'User', function($scope, $rootScope, $timeout, User) {

  $scope.viewModelState = {
    intro: true,
    returningUser: false,
    loginUser: false,
    newUser: false,
    newUserStep: 1,
    maxUserSteps: 4,
    newReservation: false,
    resStep: 1,
    maxResSteps: 3,
    maxUserSteps: 3,
    addPet: false,
    addPetStep: 1,
    finalConfirm: false
  };

  if ($rootScope.signingUp) {
    $scope.defaultState(true);
    $scope.viewModelState.newUser = true;
  };

  $scope.loginUserObject = {
    username: '',
    password: ''
  };

  $scope.setDefaultUser = function () {
    //Form Values:
    $scope.newUser = {
      first: '',
      last: '',
      username: '',
      email: '',  
      ph1 : '',
      ph2 : '',
      phArea : '',
      phone: '',
      street: '',
      city: '',
      state: 'MA',
      zip: '',
      hospital: '',
      created_at: undefined,
      updated_at: undefined,
      admin: false,
      password: '',
      passwordConfirm: ''
    };
  };

  $scope.setDefaultUser();

  $scope.newReservation = $scope.newReservation || {
    service: '',
    checkInDate: '',
    checkOutDate: '',
    checkInTime: '',
    checkOutTime: '',
    bringingOwnFood: false,
    returningGuest: false,
    preferredContact: 'email',
    comments: '',
    owner: '',
    pets: []
  };

  $scope.newPet = {
    name: '',
    type: '',
    breed: '',
    weight: 0,
    color: '',
    age: 0,
    neutered: false,
    foodBrand: '',
    foodServings: '',
    foodAllergies: '',
    comments: ''
  };

  $scope.loginLoading = false;
  $scope.serviceSelected = '';
  $scope.registrationTitle = 'YOUR INFORMATION';
  $scope.reservationTitle = 'SELECT YOUR DATES';
  $scope.addPetTitle = 'MY PET IS A...';
  $scope.reservationBackButton = 'EDIT DATES';
  $scope.reservationFwdButton = 'SELECT PETS';
  $scope.newUserButton = 'NEXT';
  $rootScope.registrationError = '';
  $scope.reservationError = '';
  $scope.resultMessage = '';
  $scope.cardClicked = '';
  $scope.refresh = false;
  $scope.displayedSpecies = "DOG";
  $scope.states = ['MA', 'RI', 'NH', 'CT', 'ME', 'VT', 'NY', 'NJ', 'DE', 'PA'];

  var clicked = false;

  $scope.refreshView = function () {
    $scope.refresh = true;
    $scope.refresh = false;
  };

  $scope.defaultState = function () {
    for (var state in $scope.viewModelState) {
      $scope.viewModelState[state] = false;
    };
    $rootScope.registrationError = '';
    $scope.resStep = 1;
    $scope.maxUserSteps = 3;
    $scope.maxResSteps = 3;

    if (arguments.length > 0) {
      return;
    } else {
      $scope.viewModelState.intro = true;
    };
  };

  $scope.defaultState();

  $scope.returningUser = function () {
    $scope.defaultState(true)
    $scope.cardClicked = 'returningUser';
    $rootScope.$broadcast('cardAdvance');
    $scope.viewModelState.returningUser = true;
  };

  $scope.addNewUser = function () {
    $scope.defaultState(true);
    $scope.viewModelState.newUser = true;
    $scope.viewModelState.newUserStep = 'basicInfo';
  };

  $scope.backNewUser = function () {
    if ($scope.viewModelState.newUserStep === 'basicInfo') {
      return;
    } else if ($scope.viewModelState.newUserStep === 'addressInfo') {
      $scope.registrationTitle = 'YOUR INFORMATION';
      $('#left-chevron').addClass('disabled');
      $scope.viewModelState.newUserStep = 'basicInfo';
    } else if ($scope.viewModelState.newUserStep === 'passwordInfo'){
      $scope.registrationTitle = 'YOUR ADDRESS';
      $scope.viewModelState.newUserStep = 'addressInfo';
    };
  };

  $scope.advanceNewUser = function () {

    console.log("CALLED advanceNewUser:", $scope.viewModelState);

    $scope.phoneConcat();

    if ($scope.viewModelState.newUserStep === 'basicInfo') {

      if ($scope.newUser.first.length === 0 || $scope.newUser.last.length === 0) {
        $rootScope.registrationError = 'Please enter a first and last name';
        $rootScope.$broadcast('registrationError');
        return;
      } else if ($scope.newUser.phone.length !== 10) {
        $rootScope.registrationError = 'Please enter a phone number';
        $rootScope.$broadcast('registrationError');
        return;
      } else if ($scope.newUser.username.length < 6 || $scope.newUser.username.indexOf('@') === -1 || $scope.newUser.username.indexOf('.') === -1) {
        $rootScope.registrationError = 'Please enter a valid e-mail';
        $rootScope.$broadcast('registrationError');
        return;
      } else {
        $rootScope.registrationError = '';
        $scope.registrationTitle = 'YOUR ADDRESS';
        $scope.viewModelState.newUserStep = 'addressInfo';
        $('#left-chevron').removeClass('disabled');
      };

    } else if ($scope.viewModelState.newUserStep === 'addressInfo') {

      if ($scope.newUser.street.length === 0 || $scope.newUser.city.length === 0) {
        $rootScope.registrationError = 'Please enter a street address';
        $rootScope.$broadcast('registrationError');
      } else if ($scope.newUser.zip.length !== 5) {
        $rootScope.registrationError = 'Please enter a valid 5-digit ZIP code';
        $rootScope.$broadcast('registrationError');
      } else {
        $rootScope.registrationError = '';
        $scope.viewModelState.newUserStep = 'passwordInfo'
        $scope.newUserButton = 'REGISTER';
        $scope.registrationTitle = 'YOUR PASSWORD';
      };

    } else if ($scope.viewModelState.newUserStep === 'passwordInfo') {

      if ($scope.newUser.password !== $scope.newUser.passwordConfirm) {
        $rootScope.registrationError = 'Passwords do not match';
        $rootScope.$broadcast('registrationError');
      } else if ($scope.newUser.password.length < 8) {
        $rootScope.registrationError = 'Password must be at least 8 characters';
        $rootScope.$broadcast('registrationError');
      } else {
        $rootScope.registrationError = '';
        $scope.signUp();
      };
    };
    console.log("CALLED advanceNewUser:", $scope.viewModelState);
  };
  
  $scope.goHome = function () {
    $scope.defaultState();
  };

  $scope.serviceSelect = function (service) {
    $scope.defaultState(true);    

    if (service === 'boarding') {
      $scope.serviceSelected = 'boarding';
    } else if (service === 'daycare') {
      $scope.serviceSelected = 'daycare';
    };

    if($scope.serviceSelected === 'daycare') {
        $scope.reservationTitle = "SELECT A DATE";
      } else if ($scope.serviceSelected === 'boarding') {
        $scope.reservationTitle = "SELECT YOUR DATES";
      };

    if ($rootScope.user && $rootScope.user.isLoggedIn) {
      $scope.viewModelState.newReservation = true;
      $scope.viewModelState.resStep = 1;
    } else {
      $scope.viewModelState.loginUser = true;
    };
  };

  $scope.addReservation = function () {
    $scope.defaultState(true);
    $scope.viewModelState.newReservation = true;
    $scope.newReservation.owner = $rootScope.user.email;
    $scope.viewModelState.resStep = 1;
  };  

  var formatDateString = function (dateString) {
    var formattedDateString = '';
    dateString = dateString + '';
    var year = dateString.slice(11, 15);
    var month = dateString.slice(4, 7);
    var day = dateString.slice(8, 10);
    formattedDateString = month + " " + day + ", " + year;
    return formattedDateString;
  };

  var formatDisplayDates = function () {
    $scope.displayCheckInDate = formatDateString($scope.newReservation.checkInDate);

    if ($scope.serviceSelected === 'boarding') {
      $scope.displayCheckOutDate = formatDateString($scope.newReservation.checkOutDate);
    };
  };

  $scope.advanceReservationStep = function () {
    if ($scope.viewModelState.resStep !== $scope.viewModelState.maxResSteps && $scope.viewModelState.resStep === 1) {
  
      if ($scope.serviceSelected === 'boarding' && ($scope.newReservation.checkInDate > $scope.newReservation.checkOutDate)) {
        //validate dates
        $rootScope.registrationError = "Please select valid check-in and check-out dates";
        $rootScope.$broadcast('registrationError');
        return;
      } else if ($scope.serviceSelected === 'boarding' && $scope.newReservation.checkInDate === '' && $scope.newReservation.checkOutDate === '') {
        $rootScope.registrationError = "Please select a check-in and check-out date";
        $rootScope.$broadcast('registrationError');
        return;
      } else if ($scope.serviceSelected === 'daycare' && $scope.newReservation.checkInDate === '') {
        $rootScope.registrationError = "Please select a date";
        $rootScope.$broadcast('registrationError');
        return;
      } else {
        //RADIO VALIDATION & BINDING:
        var bringingFoodYes = $('#bringingFoodYes').prop('checked');
        var bringingFoodNo = $('#bringingFoodNo').prop('checked');
        var returningGuestYes = $('#returningGuestYes').prop('checked');
        var returningGuestNo = $('#returningGuestNo').prop('checked');
    
        if ($scope.serviceSelected === 'boarding' && (bringingFoodYes === false && bringingFoodNo === false)) {
          $rootScope.registrationError = "Please select whether or not you'll be bringing food from home for your pets.";
          $rootScope.$broadcast('registrationError');
          return;
        };

        if (bringingFoodYes === true) {
          $scope.newReservation.bringingOwnFood = true
        } else if (bringingFoodYes === false) {
          $scope.newReservation.bringingOwnFood = false;
        } else if (returningGuestYes === true) { 
          $scope.newReservation.returningGuest = true;
        } else if (returningGuestNo === true) {
          $scope.newReservation.returningGuest = false;
        };

        //ADVANCE USER:
        $rootScope.registrationError = "";
        $scope.reservationTitle = "WHO'S STAYING?";
        $scope.reservationFwdButton = "REVIEW & BOOK";
        $scope.reservationBackButton = "EDIT DATES";
        $scope.viewModelState.resStep = 2;
      };

    } else if ($scope.viewModelState.resStep !== $scope.viewModelState.maxResSteps && $scope.viewModelState.resStep === 2) {

      if ($scope.newReservation.pets.length === 0) {
        $rootScope.registrationError = "Please add at least one pet to your reservation";
        $rootScope.$broadcast('registrationError');
        return;
      } else {
        $rootScope.registrationError = "";
        $scope.reservationTitle = "REVIEW & CONFIRM";
        formatDisplayDates();
        $scope.reservationFwdButton = "CONFIRM";
        $scope.reservationBackButton = "EDIT PETS";
        $scope.viewModelState.resStep = 3;
      };
    } else if ($scope.viewModelState.resStep === 3) {

      var contactEmail = $('#contact-email').prop('checked');
      var contactPhone = $('#contact-phone').prop('checked');
      var contactText = $('#contact-text').prop('checked');

        console.log("CONTACT CHECKS: ", contactEmail, contactPhone, contactText);

      if (contactEmail === false && contactPhone === false && contactText === false) {
        $rootScope.registrationError = "Please select a preferred contact method to confrim your reservation";
        $rootScope.$broadcast('registrationError');
        return; 
      } 

      if (contactEmail === true) {
        $scope.newReservation.preferredContact = 'email';
      } else if (contactPhone === true) {
        $scope.newReservation.preferredContact = 'phone';
      } else if (contactText === true) {
        $scope.newReservation.preferredContact = 'text';
      };

      //SUBMIT FINAL:
      $scope.createNewReservation();
    };
};

  $scope.backReservationStep = function () {
    if ($scope.viewModelState.resStep !== 1) {
      $scope.viewModelState.resStep -=1;
    };

    if ($scope.viewModelState.resStep === 1) {
      
      if($scope.serviceSelected === 'daycare') {
        $scope.reservationTitle = "SELECT A DATE";
      } else if ($scope.serviceSelected === 'boarding') {
        $scope.reservationTitle = "SELECT YOUR DATES";
      };

      $scope.reservationFwdButton = "SELECT PETS";
      $scope.reservationBackButton = "EDIT DATES";
    } else if ($scope.viewModelState.resStep === 2) {
      $rootScope.registrationError = "";
      $scope.reservationTitle = "WHO'S STAYING?";
      $scope.reservationFwdButton = "REVIEW & BOOK";
      $scope.reservationBackButton = "EDIT DATES";
            //$scope.reservationBackButton = "BACK TO DATES";
    };
  };

  $scope.addPetToReservation = function (petName) {
    for (var i = 0; i < $rootScope.user.pets.length; i++) {
      if ($rootScope.user.pets[i].name === petName) {
        $scope.newReservation.pets.push($rootScope.user.pets[i]);
      };
    };

    $('#dummy-table-row').removeClass('pet-collection-empty-text');
  };

  $scope.removePetFromReservation = function (petName) {
    for (var i = 0; i < $scope.newReservation.pets.length; i++) {
      if ($scope.newReservation.pets[i].name === petName) {
        var removedPet = $scope.newReservation.pets.splice(i, 1);
      };
    };

    if ($scope.newReservation.pets.length === 0) {
      $('#dummy-table-row').addClass('pet-collection-empty-text');
    };
  };

  $scope.showPetForm = function () {
    $scope.defaultState(true);
    $scope.viewModelState.resStep = 2; 
    $scope.viewModelState.addPet = true;
    $scope.viewModelState.addPetStep = 1;
  };

  $scope.addPets = function () {
    $scope.defaultState(true);
    $scope.viewModelState.resStep = 2;
  };

  $scope.setSpecies = function (species) {
    $scope.defaultState(true);

    if (species === 'dog') {
      $scope.newPet.type = 'dog';
      $scope.displayedSpecies = 'DOG';
      $scope.addPetTitle = 'MY DOG\'S INFO'
    } else if (species === 'cat') {
      $scope.newPet.type = 'cat';
      $scope.displayedSpecies = 'CAT';
      $scope.addPetTitle = 'MY CAT\'S INFO'
    };

    $scope.viewModelState.resStep = 2;
    $scope.viewModelState.addPet = true;
    $scope.viewModelState.addPetStep = 2;
  };

  $scope.addPet = function () {
    if (clicked === true) { return;}; 
    clicked = true;

    var owner = $rootScope.user;
    var newPet = $scope.newPet;
    newPet.owner = owner.email;
    newPet.existingPets = owner.pets;

    if (newPet.name.length === 0) {
      $rootScope.registrationError = 'Please enter a name for your pet';
      $rootScope.$broadcast('registrationError');
    } else if (newPet.weight === 0) {
      $rootScope.registrationError = 'Please enter an approximate weight for your pet';
      $rootScope.$broadcast('registrationError');
    } else if (newPet.age === 0) {
      $rootScope.registrationError = 'Please enter an approximate age for your pet';
      $rootScope.$broadcast('registrationError');
    };

    User.addPet(newPet)
      .then(function(res){
        console.log("ADDED PET: ", res);
        console.log("PET OBJECT: ", res.data.pet)
        //update local user object
        $rootScope.user.pets = res.data.updatedPets;
        $('#dummy-table-row').removeClass('pet-collection-empty-text');
        //update user object in DB    
        var reqPayload = JSON.stringify($rootScope.user);
          console.log("PAYLOAD: ", reqPayload);
        User.addPetToUser(reqPayload)
          .then(function(res){
            console.log("CALLED ADD PET TO USER: ", res);
            clicked = false;
            if (res.data.success === true) {
              $scope.defaultState(true);
              $scope.reservationTitle = "WHO'S STAYING?";
              $scope.reservationFwdButton = "REVIEW & BOOK";
              $scope.viewModelState.resStep = 2;
                console.log("YAY UPDATED USER: ", $rootScope.user);
                console.log("VM STATE: ", $scope.viewModelState);
            } else {
              console.log("ERROR ADDING PET TO USER: ", res.data.error)
              $rootScope.registrationError = "Unable to add pet to user";
              $rootScope.$broadcast('registrationError');
            };
          });
      })
  };

  $scope.phoneConcat = function () {
    $scope.newUser.phone = ($scope.newUser.phArea + $scope.newUser.ph1 + $scope.newUser.ph2);
  };

  $scope.createNewReservation = function () {
    if (clicked === true) { return; };
    clicked = true;

    if ($scope.serviceSelected === 'boarding') {
      $scope.newReservation.service = 'boarding';
    } else {
      $scope.newReservation.service = 'daycare';
    };

      console.log("CALLED CREATE NEW RESERVATION: ", $scope.newReservation);
    var reservation = $scope.newReservation;
    reservation.owner = $rootScope.user.email;
    reservation.existingReservations = $rootScope.user.reservations;
      console.log("RESERVATION ASSIGNMENTS: ", reservation);

    User.addReservation(reservation)
      .then(function(res){
        console.log("ADDED RESERVATION TO RESERVATION DB - RES:", res.data);

        if (res.data.success === true) {
          //update local user:
          $rootScope.user.reservations.push(res.data.reservation);
            console.log("ADDED RESERVATION TO LOCAL USER:", $rootScope.user);

          var updateObject = {};
          updateObject.updatedReservations = res.data.updatedReservations;
          updateObject.owner = $rootScope.user.email;

          User.addReservationToUser(updateObject)
            .then(function(res){

              //THIS SEEMS TO BE MISSING EXISTING RESERVATIONS...
                console.log("SUCCESS ADDED RES TO USER IN DB:", res.data);

              clicked = false; 

              if (res.data.success === true) {
                $scope.defaultState(true);
                $scope.viewModelState.finalConfirm = true;
              } else {
                $rootScope.registrationError = res.data.error;
                $rootScope.$broadcast('registrationError');
              };
            });
        } else {
          clicked = false; 
          $rootScope.registrationError = res.data.error;
          $rootScope.$broadcast('registrationError');
        };
      });
  };

  $scope.loginUser = function () {
    //$scope.loginLoading = true;
    
    if ($scope.loginUserObject.username.length > 3 && $scope.loginUserObject.password.length > 7) {
      User.logIn($scope.loginUserObject)
      .then(function(res){
        $scope.loginLoading = false;

        if (res.status === 401) {
          $rootScope.registrationError = "Invalid username or password";
          $rootScope.$broadcast('registrationError');   
        };

        if (res.data.isLoggedIn) {
          $rootScope.user = res.data.user;

          if ($scope.serviceSelected && $scope.serviceSelected === 'boarding') {
            $scope.addReservation();
          } else if ($scope.serviceSelected && $scope.serviceSelected === 'daycare') {
            $scope.addReservation();
          }; 
        } else {
          console.log("INVALID USERNAME OR PASSWORD:", res.data);
        };
      });
    } else {
      $rootScope.registrationError = "Please enter a username and password";
      $rootScope.$broadcast('registrationError');   
    };
  };  

  $scope.signUp = function () {
    $rootScope.loading = true;
    $scope.registrationError = '';
    $scope.phoneConcat();
    $scope.newUser.email = $scope.newUser.username;
    User.register($scope.newUser)
      .then(function (res){
        if (res.data.success === true) {
          $rootScope.user = res.data.user
          $scope.defaultState(true);
          $scope.cardClicked = 'returningUser';
          $rootScope.$broadcast('cardAdvance');
          $rootScope.loading = false;
          $scope.setDefaultUser();
          $scope.viewModelState.returningUser = true;
        } else {
          if (res.data.error.message) {
            $rootScope.registrationError = res.data.error.message;
            console.log("registrationError1:", $rootScope.registrationError);
          } else if (res.data.message) {
            $rootScope.registrationError = res.data.message;
            console.log("registrationError2:", $rootScope.registrationError);
          }

          else if (res.data.error.code === 11000) {
            $rootScope.registrationError = "A user with this e-mail address has already registered.";
            console.log("registrationError3:", $rootScope.registrationError);
          };
          $rootScope.$broadcast('registrationError');
        };
      }), function (errorCallback) {
        console.log("ERROR: ", res);
        // TO DO: Server side error handling
      };
  };

  var init = function () {
    $('.modal-trigger').leanModal();
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
    });
    $('select').material_select(); //is this being called at the correct time?
  };

  init();

  //EVENT RECEIVERS:
  $rootScope.$on('cardAdvance', function(){

    var returning = $('#matcard-action-returning');
    var newUser = $('#matcard-action-new');

    returning.removeClass('animated flipInY');
    newUser.removeClass('animated flipInY');

    if ($scope.cardClicked === 'returningUser') {
      returning.addClass('animated flipInY');

      $timeout(function(){
        returning.removeClass('animated flipInY');
        returning.addClass('grow');
      }, 750);

    } else if ($scope.cardClicked === 'newUser') {
      newUser.addClass('animated flipInY');
    };
    $scope.refreshView()
  });

  $rootScope.$on('registrationError', function(){
      console.log("ERROR:", $rootScope.registrationError);
    $('#registration-form-container').addClass('animated shake')
    $scope.refreshView()
    $timeout(function(){
      $('#registration-form-container').removeClass('animated shake');
    }, 1500);

  });

  
}]);