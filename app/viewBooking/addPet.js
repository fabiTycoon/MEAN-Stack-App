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
    age: 0
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

.factory('Pet', ['$http', function  ($http){

  var create = function(data) {
    console.log('data:', data);
    return $http.post('/api/pets/', data);
  };

  var read = function(petId) {
    return $http.get('/api/pets/' + petId);
  }

  var edit = function(petId, data) {
    return $http.put('/api/pets/' + petId, data);
  };

  var del = function(petId) {
    return $http.delete('/api/pets/' + petId);
  };

  return {
    create: create,
    read: read,
    edit: edit,
    del: del
  };

}])

.directive('boardingIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewBooking/boardingIcon.html',
    replace: true,
  }
}])

.directive('daycareIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewBooking/daycareIcon.html',
    replace: true,
  }
}])

.directive('newUserIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewBooking/bowl.html',
    replace: true,
  }
}])

.directive('returningUserIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewBooking/checklist.html',
    replace: true,
  }
}]);