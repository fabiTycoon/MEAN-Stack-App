'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {

  $scope.facilSel = true;
  $scope.teamSel = false;
  $scope.faqSel = false;
  $scope.contactSel = false;

  $scope.selFacil = function () {
    console.log("selFacil called")
    $scope.facilSel = true;
    $scope.teamSel = false;
    $scope.faqSel = false;
    $scope.contactSel = false;
  };

  $scope.selTeam = function () {
    console.log("selTeam called")
    $scope.facilSel = false;
    $scope.teamSel = true;
    $scope.faqSel = false;
    $scope.contactSel = false;
  };

  $scope.selFaq = function () {
    console.log("selFaq called")
    $scope.facilSel = false;
    $scope.teamSel = false;
    $scope.faqSel = true;
    $scope.contactSel = false;
  };

  $scope.selContact = function () {
    console.log("selContact called")
    $scope.facilSel = false;
    $scope.teamSel = false;
    $scope.faqSel = false;
    $scope.contactSel = true;
  };
}]);