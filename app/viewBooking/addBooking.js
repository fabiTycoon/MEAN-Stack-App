'use strict';

angular.module('myApp.viewAddBooking', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addBooking', {
    templateUrl: 'viewBooking/addBooking.html',
    controller: 'AddBookingCtrl'
  });
}])

.controller('AddBookingCtrl', [ '$scope', function($scope) {

  

  $scope.newReservation = {
    checkInDate: '',
    checkOutDate: '',
    checkInTimeHr: '',
    checkInTimeMin: '',
    checkInTimeDp: '',
    checkOutTimeHr: '',
    checkOutTimeMin: '',
    checkOutTimeDp: ''
  };

  var init = function () {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
    });

    $('select').material_select();
  };

  init();
}]);