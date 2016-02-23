'use strict';

angular.module('myApp.viewAddUser', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book', {
    templateUrl: 'viewBooking/addUser.html',
    controller: 'AddUserCtrl',
  });
}])

.controller('AddUserCtrl', ['$scope', 'User', function($scope, User) {

  $scope.currentDate = Date.now();

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
    hospital: ''
  };

  $scope.phArea = '';
  $scope.ph1 = '';
  $scope.ph2 = '';

  $scope.state = [];


  $scope.phoneConcat = function () {
    $scope.newOwner.phone = ($scope.phArea + $scope.ph1 + $scope.ph2);
  }

  $scope.createUser = function (data) {
    User.create(data);
  };

  $scope.signUp = function () {
    $scope.phoneConcat();
    $scope.createUser($scope.newOwner);
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

  var create = function(data) {
    console.log('user sign up factory called, data is:', data);
    return $http.post('/api/users/register/', data);
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
    create: create,
    read: read,
    edit: edit,
    del: del
  };

}]);