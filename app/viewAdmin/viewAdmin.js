'use strict';

angular.module('myApp.viewAdmin', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin', {
    templateUrl: 'viewAdmin/admin.html',
    controller: 'viewAdminCtrl'
  });
}])

.controller('viewAdminCtrl', [ '$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {



  var init = function () {
  };

  init();
}]);