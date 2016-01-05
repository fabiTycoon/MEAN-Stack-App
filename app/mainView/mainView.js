'use strict';

angular.module('myApp.mainView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'mainView/mainView.html',
    controller: 'MainViewCtrl'
  });
}])

.controller('MainViewCtrl', [function() {

   $(document).ready(function(){
      $('.parallax').parallax();
    });
  
}])

.directive('footer', [function(){
  return  {
  restrict: 'E',
  templateUrl: 'mainView/footer.html',
  replace: true,
  controller: 'MainViewCtrl'
};
}]);

;