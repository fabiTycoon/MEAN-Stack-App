'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {

  $scope.select = {
    facil: true,
    team: false,
    faq: false,
    contact: false
  }

  $scope.selector = function (selectorKey) {
    for (var key in $scope.select) {
      $scope.select[key] = false;
    }
    $scope.select[selectorKey] = true;
    console.log($scope.select);
  };


}]);