'use strict';

angular.module('myApp.viewAbout', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewAbout', {
    templateUrl: 'viewAbout/viewAbout.html',
    controller: 'ViewAboutCtrl'
  });
}])

.controller('ViewAboutCtrl', ['$scope', '$timeout', function($scope, $timeout) {

  $scope.select = {
    facil: true,
    team: false,  
    faq: false,
    contact: false
  }

  $scope.selector = function (selectorKey) {

    $('.collection-item active').removeClass('.collection-item active')
    $('#facil').removeClass('.collection-item active')
    $('#team').removeClass('.collection-item active')
    $('#faq').removeClass('.collection-item active')
    $('#contact').removeClass('.collection-item active')

    //activeItemPrev.addClass('.collection-item')
    var activeSelector = '#' + selectorKey;
    var activeItemCurr = $(activeSelector);

    //team, faq, #contact

    activeItemCurr.removeClass('.collection-item active');
    activeItemCurr.addClass('.collection-item active');

    for (var key in $scope.select) {
      $scope.select[key] = false;
    }
    $scope.select[selectorKey] = true;
    $('.parallax').parallax(); 
    console.log($scope.select);
  };

  var init = function () {
    $(document).ready(function(){
      $('.parallax').parallax();   
    });
  };
  
  init();


}]);