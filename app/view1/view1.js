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

    var activeItemPrev = $('.collection-item active');
    activeItemPrev.removeClass('.collection-item active')
    activeItemPrev.addClass('.collection-item')

    var activeSelector = '#' + selectorKey;
    var activeItemCurr = $(activeSelector);
    activeItemCurr.removeClass('.collection-item');
    activeItemPrev.addClass('.collection-item active')

    for (var key in $scope.select) {
      $scope.select[key] = false;
    }
    $scope.select[selectorKey] = true;
    console.log($scope.select);
  };


}]);