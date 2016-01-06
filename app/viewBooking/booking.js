'use strict';

angular.module('myApp.bookingView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book', {
    templateUrl: 'viewBooking/booking.html',
    controller: 'BookingViewCtrl'
  });
  $routeProvider.when('/bookDog', {
    templateUrl: 'viewBooking/bookDog.html',
    controller: 'BookingViewCtrl'
  });
  $routeProvider.when('/bookCat', {
    templateUrl: 'viewBooking/bookCat.html',
    controller: 'BookingViewCtrl'
  });
  $routeProvider.when('/bookNext', {
    templateUrl: 'viewBooking/bookNext.html',
    controller: 'BookingViewCtrl'
  });



}])

.controller('BookingViewCtrl', [function() {

  $scope.owner = {
    first: '',
    last: '',
    phone: '',
    email: '',
    dates: []
  }
  $scope.currentPets = [];
  $scope.currentPet = {
    species: '',
    name: ''

  }


}]);