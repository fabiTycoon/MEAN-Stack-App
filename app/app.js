'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngMessages',
  'myApp.viewAbout',
  'myApp.viewGallery',
  'myApp.viewMain',
  'myApp.viewAddUser',
  'myApp.viewAddBooking',
  'myApp.addPetView',
  'myApp.viewLogin',
  'myApp.version',
  //'myApp.basicServices',
  'myApp.directivesModule',
  'ngMessages',
  'ngSanitize'
]).
config(['$routeProvider', function($routeProvider) {

  $routeProvider.otherwise({redirectTo: '/main'});
  //add additional routes

}])

.factory('User', ['$http', '$rootScope', '$q', function  ($http, $rootScope, $q){

  var registrationError = '';

  this.user = this.user || {
    isLoggedIn: false,
    pets: [],
    reservations: []
  };

  this.loginStatus = this.loginStatus || false;

  var getLoginStatus = function () {
    var status = this.loginStatus;
    return status;
  };

  var toggleLoginStatus = function () {
    this.user.isLoggedIn = !this.user.isLoggedIn;
  };
  
  var setUser = function (user) {
    return this.user = user;
  };

  var getUser = function () {
    var user = this.user;
    return user;
  };

  var logIn = function(data) {
    return $http.post('/api/users/login', data);
  };

  var logOut = function() {
      console.log("called logout")
    return $http.get('/api/users/logout');
  };

  var create = function(data) {
    console.log("Called createUser factory, data is:", data);
    return $http.post('/api/users/register/', data)
      .then(function (res){
          console.log("OMGRESPONSE: ", res);
          console.log("OMGRESPONSE: ", res);
        $rootScope.registrationError = res.data.message;
        $rootScope.$broadcast('registrationError');
        return res.data;
      }), function (errorCallback) {
        console.log("ERROR: ", res);
        // TO DO: Server side error handling
      };
  };

  var read = function(userId) {
    return $http.get('/api/users/' + userId);
  }

  var edit = function(userId, data) {
    return $http.put('/api/users/' + userId, data);
  };

  var del = function(userId) {
    return $http.delete('/api/users/' + userId);
  };

  return {
    setUser: setUser,
    getUser: getUser,
    getLoginStatus: getLoginStatus,
    registrationError: registrationError,
    logIn: logIn,
    create: create,
    read: read,
    edit: edit,
    del: del
  };

}]);
