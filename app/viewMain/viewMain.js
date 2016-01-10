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
}]);
;