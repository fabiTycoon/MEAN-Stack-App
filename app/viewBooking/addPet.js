'use strict';

angular.module('myApp.addPetView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addPet', {
    templateUrl: 'viewBooking/addPet.html',
    controller: 'AddPetCtrl'
  });
}])

.controller('AddPetCtrl', [ '$scope', function($scope) {

  $scope.currentPets = [];


  //bind owner here, or elsewhere?  wait until sessions is implemented
  $scope.currentPet = {
    species: '',
    name: '',
    breed: '',
    owner: '',
    neutered: false,
    color: '',
    age,
  };

  //Controls Add a Pet View display
  $scope.dogSelected = false;
  $scope.catSelected = false;
  $scope.otherSelected = false;

  $scope.speciesSelector = function (species) {

    if (species === 'dog') {
      $scope.currentPet[species] = 'dog';
      $scope.dogSelected = true;
      $scope.catSelected = false;
      $scope.otherSelected = false;
    } else if (species === 'cat') {
      $scope.currentPet[species] = 'cat';
      $scope.dogSelected = false;
      $scope.catSelected = true;
      $scope.otherSelected = false;
      
    } else if (species === 'other') {
      $scope.dogSelected = false;
      $scope.catSelected = false;
      $scope.otherSelected = true;
    }
  };

}])

;