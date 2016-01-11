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
    zip: ''
  };

  $scope.newReservation = {
    checkInDate: '',
    checkOutDate: '',
    checkInTime: '',
    checkOutTime: ''
  }

  var init = function () {
    $('select').material_select();    
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
    });
  };

  init();
}])

.factory('AddUser', ['$http', function  ($http){

  var create = function(data) {
    console.log('data:', data);
    return $http.post('/api/users/', data);
  };

  var edit = function(userId, data) {
    return $http.put('/api/users/' + userId, data);
  };

  var del = function(userId) {
    return $http.delete('/api/users/' + userId);
  };

  return {
    create: create,
    edit: edit,
    del: del
  };

}]);