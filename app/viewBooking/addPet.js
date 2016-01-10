'use strict';

angular.module('myApp.addPetView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addPet', {
    templateUrl: 'viewBooking/addPet.html',
    controller: 'AddPetCtrl'
  });
}])

.controller('AddPetCtrl', [function() {

}])

;