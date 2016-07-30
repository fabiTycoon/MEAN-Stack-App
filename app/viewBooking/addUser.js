'use strict';

angular.module('myApp.viewAddUser', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book', {
    templateUrl: 'viewBooking/addUser.html',
    controller: 'AddUserCtrl',
  });
}])

.controller('AddUserCtrl', ['$scope', '$rootScope', '$timeout', 'User', function($scope, $rootScope, $timeout, User) {

  $rootScope.user = {
    isLoggedIn: User.getLoginStatus(),
    reservations: [],
    pets: []
  };

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

  //Form Values:
  $scope.newUser = {
    first: '',
    last: '',
    phArea: '',
    ph1: '',
    ph2: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: 'MA',
    zip: '',
    hospital: '',
    password: '',
    passwordConfirm: ''
  };

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

      /*if ($scope.newUser.first.length === 0 || $scope.newUser.last.length === 0) {
        $rootScope.registrationError = 'Please enter a first and last name';
        $rootScope.$broadcast('registrationError');
        return;
      } else if ($scope.newUser.phone.length !== 10) {
        $rootScope.registrationError = 'Please enter a phone number';
        $rootScope.$broadcast('registrationError');
        return;
      } else if ($scope.newUser.email.length < 6) {
        $rootScope.registrationError = 'Please enter a valid e-mail';
        $rootScope.$broadcast('registrationError');
        return;
      } else {*/
        $rootScope.registrationError = '';
        $scope.registrationTitle = 'YOUR ADDRESS';
        $scope.viewModelState.newUserStep = 'addressInfo';
        $('#left-chevron').removeClass('disabled');
      //};

    } else if ($scope.viewModelState.newUserStep === 'addressInfo') {

      /*if ($scope.newUser.street.length === 0 || $scope.newUser.city.length === 0) {
        $rootScope.registrationError = 'Please enter a street address';
        $rootScope.$broadcast('registrationError');
      } else if ($scope.newUser.zip.length !== 5) {
        $rootScope.registrationError = 'Please enter a valid 5-digit ZIP code';
        $rootScope.$broadcast('registrationError');
      } else {*/
        $rootScope.registrationError = '';
        $scope.viewModelState.newUserStep = 'passwordInfo'
        $scope.registrationTitle = 'YOUR PASSWORD';
      //};

    } else if ($scope.viewModelState.newUserStep === 'passwordInfo') {

      /*if ($scope.newUser.password !== $scope.newUser.passwordConfirm) {
        $rootScope.registrationError = 'Passwords do not match';
        $rootScope.$broadcast('registrationError');
      } else {*/
        $rootScope.registrationError = '';
        $scope.signUp();
      //};
    };
    console.log("CALLED advanceNewUser:", $scope.viewModelState);
  };

  $scope.signUp = function () {
    $scope.registrationError = '';
    $scope.phoneConcat();
    User.create($scope.newUser);
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

    if ($rootScope.user.isLoggedIn === true) {
      $scope.viewModelState.newReservation = true;
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
    //pet.owner = ownerID;

  };

  $scope.phoneConcat = function () {
    console.log("phone concat, # is:", $scope.newUser.ph1, $scope.newUser.ph2);
    $scope.newUser.phone = ($scope.newUser.phArea + $scope.newUser.ph1 + $scope.newUser.ph2);
    console.log("phone concat, # is:", $scope.newUser.phone);
  };

  $scope.createNewReservation = function (reservation) {

    //TO DO: ADD VALIDATION & ERROR MESSAGING FOR USER

    $rootScope.user.reservations.push(reservation);
    User.addReservation(reservation)
      .then(function(res){
        console.log("ADDED RESERVATION:", res);
        //
        $scope.viewModelState.resStep = 2;
      });
  };


  $scope.loginUser = function (data) {
    $scope.loginLoading = true;
    User.logIn(data)
      .then(function(res){
        User.loginStatus = res.data.loggedIn;
        $rootScope.user.isLoggedIn = res.data.loggedIn;

        User.getPets()
          .then(function(res){
            $rootScope.user.pets = res.data.data;
            console.log("SET USER Pet: ", $rootScope.user)
          });

        User.getReservations()
          .then(function(res){
              console.log("RESERVATIONS RES:", res);
            $rootScope.user.reservations = res.data;
            console.log("SET USER RESERVATIONS: ", $rootScope.user);
          });


        //TO DO - FIX THIS ONCE WE HAVE PETS/RESERVATION API WORKING:
        var newUser = {
          isLoggedIn: res.data.loggedIn,
          reservations: $rootScope.user.reservations,
          pets: $rootScope.user.pets
        };

        User.setUser(newUser);
        $rootScope.user = newUser;

        if (User.loginStatus === true) {
          $scope.loginLoading = false;

          if ($scope.serviceSelected && $scope.serviceSelected === 'boarding') {
            $scope.addReservation();
          } else if ($scope.serviceSelected && $scope.serviceSelected === 'daycare') {
            $scope.addReservation();
          } else {
            $scope.returningUser();
          };
        };
      });
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

//TO DO: REFACTOR IN SEPERATE MODULE:
