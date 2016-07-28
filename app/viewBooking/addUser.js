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
    newuser: false,
    newBoarding: false,
    newDaycare: false,
    addPets: false
  } || $scope.viewModelState;

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
    $scope.cardClicked = 'newUser';
    $rootScope.$broadcast('cardAdvance');
  };

  $scope.goHome = function () {
    $scope.defaultState();
  };

  $scope.boardingSelect = function () {
    $scope.defaultState(true);
    $scope.viewModelState.newBoarding = true;
  };

  $scope.daycareSelect = function () {
    $scope.defaultState(true);
    $scope.viewModelState.newDaycare = true;
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

  //Status bool to hide potentially confusing header if redirected from login
  $scope.loginRedir = false;

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
  }

  $scope.createUser = function (data) {
    User.create(data);
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

    return $http.post('/api/users/login', data);
  }

  var logOut = function(data) {
    return $http.get('/api/users/logout', data);
  }

  var create = function(data) {
    console.log("Called createUser factory, data is:", data);
    return $http.post('/api/users/register/', data)
      .then(function successCallback(resp){
        $rootScope.registrationError = resp.data.message;
        $rootScope.$broadcast('registrationError');
      }), function errorCallback(resp) {
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