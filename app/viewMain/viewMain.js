'use strict';

angular.module('myApp.viewMain', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'viewMain/viewMain.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$scope', '$rootScope', '$location', 'User', function($scope, $rootScope, $location, User) {

  $rootScope.signingUp = false;

  $scope.logOut = function () {
    if ($rootScope.user) {
      User.logOut()
        .then(function(res){
          $rootScope.user = {};
          $location.path('#/')
          console.log("LOGGED OUT")
        })
    };
  };

  var init = function () {
    $(document).ready(function(){
      $('.parallax').parallax();
      $(".button-collapse").sideNav();    
    });
  };
  
  init();
}])

/*.directive('loading-wheel', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewMain/loadingWheel.html',
    replace: true,
  }
}]) */


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

.directive('addDogIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewBooking/addDog.html',
    replace: true,
  }
}])

.directive('addCatIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewBooking/addCat.html',
    replace: true,
  }
}])

.directive('addItemIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewBooking/addItemIcon.html',
    replace: true,
  }
}])

.directive('addDogReservationIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewBooking/addDogReservationIcon.html',
    replace: true,
  }
}])

.directive('addCatReservationIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewBooking/addCatReservationIcon.html',
    replace: true,
  }
}])

.directive('editItemIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewBooking/editItemIcon.html',
    replace: true,
  }
}])

.directive('removeItemIcon', [function(){
  return  {
    restrict: 'E',
    templateUrl: 'viewBooking/removeItemIcon.html',
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