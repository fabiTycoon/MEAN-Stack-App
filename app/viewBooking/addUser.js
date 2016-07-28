'use strict';

angular.module('myApp.viewAddUser', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book', {
    templateUrl: 'viewBooking/addUser.html',
    controller: 'AddUserCtrl',
  });
}])

.controller('AddUserCtrl', ['$scope', '$rootScope', 'User', function($scope, $rootScope, User) {

  $scope.viewModelState = {
    intro: true,
    returningUser: false,
    loginUser: false,
    newUser: false,
    newUserStep: '',
    newBoarding: false,
    newDaycare: false,
    addPets: false
  } || $scope.viewModelState;

  $scope.loginUserObject = {
    email: '',
    password: ''
  };

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
    $scope.viewModelState.loginUser = true;
  };

  $scope.addPets = function () {
    $scope.defaultState(true);
    $scope.viewModelState.addPets = true;
  };

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

  // LEGACY

  $rootScope.$on('registrationError', function(){
    $('#registration-form-container').addClass('animated shake')
    $scope.refreshView()
  });


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

  $scope.phoneConcat = function () {
    $scope.newUser.phone = ($scope.phArea + $scope.ph1 + $scope.ph2);
    console.log("phone concat, # is:", $scope.newUser.phone);
  };

  $scope.loginUser = function (data) {
    console.log("CALLED LOGIN USER: ", data);
    User.logIn(data);
  };  


  $scope.createUser = function (data) {
    User.create(data); //.then
  };

  $scope.signUp = function () {
    $scope.registrationError = '';
    $scope.phoneConcat();
    return $scope.createUser($scope.newUser)
  }

  
}])

//TO DO: REFACTOR IN SEPERATE MODULE:
.factory('User', ['$http', '$rootScope', function  ($http, $rootScope){

  var registrationError = '';

  var logIn = function(data) {

    //assign return user to $rootScope.user 
    console.log("CALLED LOGIN: ", data);
    return $http.post('/api/users/login', data)
      .then(function successCallback(resp){
        console.log("RESPONSE: ", resp);
      }), function errorCallback(resp) {
        console.log("ERROR: ", resp);
      };
  };

  var logOut = function(data) {
    return $http.get('/api/users/logout', data);
  }

  var create = function(data) {
    console.log("Called createUser factory, data is:", data);
    return $http.post('/api/users/register/', data)
      .then(function successCallback(resp){
          console.log("RESPONSE: ", resp);
        $rootScope.registrationError = resp.data.message;
        $rootScope.$broadcast('registrationError');
      }), function errorCallback(resp) {
        console.log("ERROR: ", resp);
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
    registrationError: registrationError,
    logIn: logIn,
    create: create,
    read: read,
    edit: edit,
    del: del
  };

}]);