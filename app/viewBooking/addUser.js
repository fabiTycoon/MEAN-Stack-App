'use strict';

angular.module('myApp.viewAddUser', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book', {
    templateUrl: 'viewBooking/addUser.html',
    controller: 'AddUserCtrl',
  });
}])

.controller('AddUserCtrl', ['$scope', function($scope) {

  $scope.currentDate = Date.now();

  //Form Values:
  $scope.newOwner = {
    first: '',
    last: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    hospital: ''
  };

  var createUser = function () {
    AddUser.create(data);
  };

  var init = function () {
    $('select').material_select();    
  };

  init();
}])

.factory('User', ['$http', function  ($http){

  var create = function(data) {
    console.log('data:', data);
    return $http.post('/api/signup/', data);
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