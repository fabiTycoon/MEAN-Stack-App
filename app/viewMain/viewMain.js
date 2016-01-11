'use strict';

angular.module('myApp.viewMain', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'viewMain/viewMain.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', [function() {


  var init = function () {
    $(document).ready(function(){
      $('.parallax').parallax();    
    });
  };
  
  init();
}])

.directive('footer', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewMain/footer.html',
    replace: true,
    controller: 'MainCtrl'
  }
}]) 

.directive('dogIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewMain/dog.html',
    replace: true,
  }
}])

.directive('catIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewMain/cat.html',
    replace: true,
  }
}])

.directive('kennelIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewMain/kennel.html',
    replace: true,
  }
}]);

;