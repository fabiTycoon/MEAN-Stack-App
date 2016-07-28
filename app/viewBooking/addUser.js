'use strict';

angular.module('myApp.viewAddUser', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book', {
    templateUrl: 'viewBooking/addUser.html',
    controller: 'AddUserCtrl',
  });
}])

.controller('AddUserCtrl', ['$scope', '$rootScope', 'User', function($scope, $rootScope, User) {

  $rootScope.user = {
    isLoggedIn: User.getLoginStatus(),
    reservations: [],
    pets: []
  };

  $scope.viewModelState = $scope.viewModelState || {
    intro: true,
    returningUser: false,
    loginUser: false,
    newUser: false,
    newUserStep: '',
    newReservation: false,
    addPets: false,
    addPet: false
  };

  $scope.loginUserObject = {
    username: '',
    password: ''
  };

  //Form Values:
  $scope.newUser = {
    first: '',
    last: '',
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

  $scope.phArea = '';
  $scope.ph1 = '';
  $scope.ph2 = '';

  $scope.loginLoading = false;
  $scope.serviceSelected = '';
  $scope.registrationTitle = 'YOUR INFORMATION';
  $rootScope.registrationError = ''
  $scope.cardClicked = '';
  $scope.refresh = false;

  $scope.refreshView = function () {
    $scope.refresh = true;
    $scope.refresh = false;
  };

  $scope.defaultState = function () {
    for (var state in $scope.viewModelState) {
      $scope.viewModelState[state] = false;
    };

    if (arguments.length > 0) {
      return;
    } else if ($rootScope.user) {
      $scope.viewModelState.returningUser = true;
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

  $scope.addNewUserAddress = function () {
    $scope.viewModelState.newUserStep = 'addressInfo';
  };

  $scope.addNewUserPassword = function () {
    $scope.viewModelState.newUserStep = 'passwordInfo';
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
  };  

  $scope.addPets = function () {
    $scope.defaultState(true);
    $scope.viewModelState.addPets = true;
  };
  $scope.phoneConcat = function () {
    $scope.newUser.phone = ($scope.phArea + $scope.ph1 + $scope.ph2);
    console.log("phone concat, # is:", $scope.newUser.phone);
  };

  $scope.loginUser = function (data) {
    $scope.loginLoading = true;
    User.logIn(data)
      .then(function(res){
        User.loginStatus = res.data.loggedIn;
        $rootScope.user.isLoggedIn = res.data.loggedIn;
        //TO DO: RETRIEVE & ASSIGN PETS & RESERVATIONS DATA

        //TO DO - FIX THIS ONCE WE HAVE PETS/RESERVATION API WORKING:
        var newUser = {
          isLoggedIn: res.data.loggedIn,
          reservations: [],
          pets: []
        };

        User.setUser(newUser);
        if (User.loginStatus === true) {
          $scope.loginLoading = false;

          if ($scope.serviceSelected && $scope.serviceSelected === 'boarding') {
            $scope.addReservation();
          } else if ($scope.serviceSelected && $scope.serviceSelected === 'daycare') {
            $scope.addReservation();
          } else {
            $scope.addPets();
          };
        };
      });
  };  

  $scope.createUser = function (data) {
    User.create(data); //.then
  };

  $scope.signUp = function () {
    $scope.registrationError = '';
    $scope.phoneConcat();
    var returnedUser = $scope.createUser($scope.newUser);
    console.log(returnedUser);
  };

  var init = function () {
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
  });

  
}])

//TO DO: REFACTOR IN SEPERATE MODULE:
.factory('User', ['$http', '$rootScope', '$q', function  ($http, $rootScope, $q){

  var registrationError = '';

  this.user = this.user || {
    isLoggedIn: false,
    pets: [],
    reservations: []
  };
  
  this.loginStatus = this.loginStatus || false;

  var getLoginStatus = function () {
    var status = this.loginStatus;
    return status;
  };

  var toggleLoginStatus = function () {
    this.user.isLoggedIn = !this.user.isLoggedIn;
  };
  
  var setUser = function (user) {
    return this.user = user;
  };

  var getUser = function () {
    var user = this.user;
    return user;
  };

  var logIn = function(data) {
    return $http.post('/api/users/login', data);
  };

  var logOut = function(data) {
    return $http.get('/api/users/logout', data);
  };

  var create = function(data) {
    console.log("Called createUser factory, data is:", data);
    return $http.post('/api/users/register/', data)
      .then(function (res){
          console.log("OMGRESPONSE: ", res);
          console.log("OMGRESPONSE: ", res);
        $rootScope.registrationError = res.data.message;
        $rootScope.$broadcast('registrationError');
        return res.data;
      }), function (errorCallback) {
        console.log("ERROR: ", res);
        // TO DO: Server side error handling
      };
  };

  var read = function(userId) {
    return $http.get('/api/users/' + userId);
  }

  var edit = function(userId, data) {
    return $http.put('/api/users/' + userId, data);
  };

  var del = function(userId) {
    return $http.delete('/api/users/' + userId);
  };

  return {
    setUser: setUser,
    getUser: getUser,
    getLoginStatus: getLoginStatus,
    registrationError: registrationError,
    logIn: logIn,
    create: create,
    read: read,
    edit: edit,
    del: del
  };

}]);