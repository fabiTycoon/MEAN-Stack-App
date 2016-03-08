'use strict';

angular.module('myApp.viewAddUser', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book', {
    templateUrl: 'viewBooking/addUser.html',
    controller: 'AddUserCtrl',
  });
}])

.controller('AddUserCtrl', ['$scope', 'User', function($scope, User) {

  $scope.registrationError = '';

  //Form Values:
  $scope.newOwner = {
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
    $scope.newOwner.phone = ($scope.phArea + $scope.ph1 + $scope.ph2);
  }

  $scope.createUser = function (data) {
    User.create(data)
      .then(function(){
        $scope.registrationError = User.userMessage;
        console.log("set regError!!!", $scope.registrationError);
      });
  };

  $scope.signUp = function () {
    $scope.phoneConcat();
    return $scope.createUser($scope.newOwner)
  }

  var init = function () {
    $('select').material_select(); 

    $(document).ready(function(){
      $('#state-select').on('change', function (){
        var selectedValue = $(this).val();
        $scope.newOwner.state = selectedValue;
      });
    });
  };

  init();
}])

.factory('User', ['$http', function  ($http){

  var userMessage = '';

  var logIn = function(data) {
    return $http.post('/api/users/login', data);
  }

  var logOut = function() {
    return $http.get('/api/users/logout');
  }

  var create = function(data) {
    console.log("Called createUser factory, data is:", data);
    return $http.post('/api/users/register/', data).then(function successCallback(resp){
      userMessage = resp.data.message;
      console.log("registration success in factory, resp is", userMessage);
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
    userMessage: userMessage,
    logIn: logIn,
    create: create,
    read: read,
    edit: edit,
    del: del
  };

}]);