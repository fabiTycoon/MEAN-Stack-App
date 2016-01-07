'use strict';

angular.module('myApp.bookingView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book', {
    templateUrl: 'viewBooking/booking.html',
    controller: 'BookingViewCtrl'
  });
  $routeProvider.when('/addPet', {
    templateUrl: 'viewBooking/addPet.html',
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

.controller('BookingViewCtrl', ['scope', function($scope) {

  $scope.currentDate = Date.now();

  //Form Values:
  $scope.owner = {
    first: '',
    last: '',
    phone: '',
    email: '',
    checkInDate: '',
    checkOutDate: ''
  }

  $scope.currentPets = [];

  $scope.currentPet = {
    species: '',
    name: ''
  }

  //Controls Add a Pet View display
  $scope.dogSelected = false;
  $scope.catSelected = false;

  $scope.speciesSelector = function (species) {
    if (species === 'dog') {
      $scope.currentPet[species] = 'dog';
    } else if (species === 'cat') {
      $scope.currentPet[species] = 'cat';
    }
  }

  var init = function () {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
    });
  }

  init();
}]);