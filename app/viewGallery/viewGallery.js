'use strict';

angular.module('myApp.viewGallery', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'viewGallery/gallery.html',
    controller: 'GalleryCtrl'
  });
}])

.controller('GalleryCtrl', [function() {

}]);