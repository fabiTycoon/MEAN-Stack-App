'use strict';

angular.module('myApp.viewMain', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'viewMain/viewMain.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$scope', function($scope) {

  var init = function () {
    $(document).ready(function(){
      $('.parallax').parallax();
      $(".button-collapse").sideNav();    
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

.directive('scrollToItem', function() {                                                      
  return {                                                                                 
  restrict: 'A',                                                                       
  scope: {                                                                             
    scrollTo: "@"                                                                    
  },                                                                                   
  link: function(scope, $elm,attr) {                                                   
    $elm.on('click', function() {                                                    
      $('html,body').animate({scrollTop: $(scope.scrollTo).offset().top }, "slow");
    });                                                                              
  }                                                                                    
}})   

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