'use strict';

angular.module('myApp.bookingView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/booking', {
    templateUrl: 'viewBooking/booking.html',
    controller: 'BookingViewCtrl'
  });
}])

.controller('BookingViewCtrl', [function() {
  


}]);