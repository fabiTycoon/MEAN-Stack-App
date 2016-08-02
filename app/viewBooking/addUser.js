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
    addPetStep: 1
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

  $scope.newReservation = {
    service: $scope.serviceSelected,
    checkInDate: '',
    checkOutDate: '',
    checkInTime: '',
    checkOutTime: '',
    bringingOwnFood: false,
    comments: '',
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
  $scope.reservationBackButton = 'BACK TO DATES';
  $scope.reservationFwdButton = 'SELECT PETS';
  $scope.newUserButton = 'NEXT';
  $rootScope.registrationError = '';
  $scope.reservationError = '';
  $scope.resultMessage = '';
  $scope.cardClicked = '';
  $scope.refresh = false;
  $scope.displayedSpecies = "DOG";

  $scope.state = ['MA', 'RI', 'NH', 'CT', 'ME', 'VT', 'NY', 'NJ', 'DE', 'PA'];

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
      } else if ($scope.newUser.username.length < 6) {
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

  $scope.signUp = function () {
    $rootScope.loading = true;
    $scope.registrationError = '';
    $scope.phoneConcat();
    $scope.newUser.email = $scope.newUser.username;
    User.register($scope.newUser)
      .then(function (res){
          console.log("RESPONSE: ", res);

        if (res.data.success) {
          $rootScope.user = res.data.user


          $scope.newUser = 
          $scope.defaultState(true);
          $scope.cardClicked = 'returningUser';
          $rootScope.$broadcast('cardAdvance');
          $rootScope.loading = false;
          $scope.setDefaultUser();
          $scope.viewModelState.returningUser = true;
            console.log("viewModelState: ", $scope.viewModelState);
            console.log("viewModelState", $scope.loginLoading);
        } else {

          if (res.data.error.message) {
            $rootScope.registrationError = res.data.error.message;
            console.log("registrationError1:", $rootScope.registrationError);
          };

          if (res.data.error.code === 11000) {
            $rootScope.registrationError = "A user with this e-mail address has already registered.";
            console.log("registrationError2:", $rootScope.registrationError);
          };

          $rootScope.$broadcast('registrationError');
        }
      }), function (errorCallback) {
        console.log("ERROR: ", res);
        // TO DO: Server side error handling
      };
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
      console.log("SET SERVICE:", $scope.serviceSelected)

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
    $scope.viewModelState.resStep = 1;
  };  

  $scope.advanceReservationStep = function () {
    if ($scope.viewModelState.resStep !== $scope.viewModelState.maxResSteps) {
      $scope.viewModelState.resStep +=1;
    };

    if ($scope.viewModelState.resStep === 2) {
      $scope.reservationTitle = "WHO'S STAYING?";
      $scope.reservationFwdButton = "REVIEW & BOOK";
      $rootScope.user.pets = [{name: 'Olivia', type: 'cat'}];
    };
  };

  $scope.backReservationStep = function () {
    if ($scope.viewModelState.resStep !== 1) {
      $scope.viewModelState.resStep -=1;
    };

    if ($scope.viewModelState.resStep === 1) {
      $scope.reservationTitle = "SELECT YOUR DATES";
    };
  };

  $scope.showPetForm = function () {
    $scope.defaultState(true);
    $scope.viewModelState.resStep = 2; //?
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
    } else if (species === 'cat') {
      $scope.newPet.type = 'cat';
      $scope.displayedSpecies = 'CAT';
    };

    $scope.addPetTitle = 'MY PET\'S INFO';
    $scope.viewModelState.resStep = 2;
    $scope.viewModelState.addPet = true;
    $scope.viewModelState.addPetStep = 2;
      console.log("VM STATE: ", $scope.viewModelState);
  };

  $scope.addPet = function (pet) {
    //pet.owner = {first: '', last: '', email: ''};

  };

  $scope.phoneConcat = function () {
    console.log("phone concat, # is:", $scope.newUser.phArea, $scope.newUser.ph1, $scope.newUser.ph2);
    $scope.newUser.phone = ($scope.newUser.phArea + $scope.newUser.ph1 + $scope.newUser.ph2);
    console.log("phone concat, # is:", $scope.newUser.phone);
  };

  $scope.createNewReservation = function (reservation) {
    //TO DO: ADD VALIDATION & ERROR MESSAGING FOR USER
      //$rootScope.user.reservations.push(reservation);
    User.addReservation(reservation)
      .then(function(res){
        console.log("ADDED RESERVATION:", res);
        //
        $scope.viewModelState.resStep = 2;
      });
  };

  //REFACTOR THIS FUNCTION:
  $scope.loginUser = function () {
    //$scope.loginLoading = true;
    
    if ($scope.loginUserObject.username.length > 3 && $scope.loginUserObject.password.length > 7) {
      User.logIn($scope.loginUserObject)
      .then(function(res){
        console.log("LOGIN RES: ", res);
        $scope.loginLoading = false;

        if (res.status === 401) {
          $rootScope.registrationError = "Invalid username or password";
          $rootScope.$broadcast('registrationError');   
        };

        if (res.data.isLoggedIn) {
          $rootScope.user = res.data.user;
            console.log("WE LOGGED IN LIKE A MOFO:", res.data.user);

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

  var init = function () {
    $('.modal-trigger').leanModal();
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
    });

    $('select').material_select();
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
    $('#registration-form-container').addClass('animated shake')
    $scope.refreshView()
    $timeout(function(){
      $('#registration-form-container').removeClass('animated shake');
    }, 1500);

  });

  
}]);