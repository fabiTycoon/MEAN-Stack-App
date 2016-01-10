'use strict';

angular.module('myApp.bookingView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book', {
    templateUrl: 'viewBooking/booking.html',
    controller: 'BookingViewCtrl',
  });
}])

.controller('BookingViewCtrl', ['$scope', function($scope) {

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
}]);