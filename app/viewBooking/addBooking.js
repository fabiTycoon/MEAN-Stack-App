'use strict';

angular.module('myApp.viewAddBooking', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addBooking', {
    templateUrl: 'viewBooking/addBooking.html',
    controller: 'AddBookingCtrl'
  });
}])

.controller('AddBookingCtrl', [ '$scope', function($scope) {

  //MAKE SEPERATE SERVICE FOR 

  $scope.loading = true;
  




// legacy
  $scope.newReservation = {
    service: '',
    checkInDate: '',
    checkOutDate: '',
    checkInTimeHr: '',
    checkInTimeMin: '',
    checkInTimeDp: '',
    checkOutTimeHr: '',
    checkOutTimeMin: '',
    checkOutTimeDp: '',
    pickup: false
  };

  $scope.pickupSelected = false;
  $scope.dropoffSelected = false;

  $scope.serviceSel = function (service) {
    $scope.selectionMade = true;
    $scope.newReservation.service = service;
  }

  $scope.transportSel = function (service) {
    if (service === 'pickup') {
      $scope.pickupSelected = true;
      $scope.newReservation.pickup = true;
    } else if (service === 'dropoff') {
      $scope.dropoffSelected = true;
    }
  }

  var init = function () {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
    });

    $('select').material_select();
  };

  init();
}]);