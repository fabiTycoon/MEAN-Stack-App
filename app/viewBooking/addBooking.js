'use strict';

angular.module('myApp.viewAddBooking', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addBooking', {
    templateUrl: 'viewBooking/addBooking.html',
    controller: 'AddBookingCtrl'
  });
}])

.controller('AddBooking', [ '$scope', function($scope) {

  

  $scope.newReservation = {
    checkInDate: '',
    checkOutDate: '',
    checkInTime: '',
    checkOutTime: ''
  }


}]);

;