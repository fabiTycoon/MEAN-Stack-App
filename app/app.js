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

  var userObject = userObject || {
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
    userObject.isLoggedIn = !userObject.isLoggedIn;
  };
  
  var setUser = function (user) {
    return userObject = user;
  };

  var getUser = function () {
    var user = userObject;
    return user;
  };

  var logIn = function(data) {
    return $http.post('/api/users/login', data);
  };

  var logOut = function() {
    return $http.get('/api/users/logout');
  };

  var addReservation = function (reservation) {
      console.log("CALLED RESERVATINO FACTORY: ", reservation);
    userObject.reservations.push(reservation);
    setUser(userObject);
    return $http.post('/api/bookings/new', reservation);
  };

  var deleteReservation = function (reservationIndex) {
    return
  };

  var editReservation = function (reservationIndex, newReservation) {
    return
  };

  var addPet = function (pet) {
    return $http.post('/api/pets', pet);
  };

  var getPets = function () {
    return $http.get('/api/pets');
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

  var getUserId = function() {
    return $http.get('/api/users/userId');
  };

  var edit = function(userId, data) {
    return $http.put('/api/users/', data);
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
    logOut: logOut,
    addReservation: addReservation,
    deleteReservation: deleteReservation, 
    editReservation: editReservation,
    create: create,
    getUserId: getUserId,
    edit: edit,
    del: del
  };

}]);
