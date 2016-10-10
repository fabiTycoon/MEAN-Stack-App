'use strict';


// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngMessages',
  'myApp.viewAbout',
  'myApp.viewGallery',
  'myApp.viewMain',
  'myApp.viewAccount',
  'myApp.viewAddUser',
  'myApp.viewAddBooking',
  'myApp.addPetView',
  'myApp.viewConfirm',
  'myApp.viewAdmin',
  'myApp.viewLogin',
  'myApp.logOut',
  'myApp.version',
  //'myApp.basicServices',
  'myApp.directivesModule',
  'ngMessages',
  'ngSanitize',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/main'});
  //add additional routes
}])

.factory('User', ['$http', '$rootScope', '$q', function  ($http, $rootScope, $q){

  var registrationError = '';

  var logIn = function(data) {
    return $http.post('/api/users/login', data);
  };

  var logOut = function() {
    return $http.get('/api/users/logout');
  };

  var addReservation = function (reservation) {
      console.log("CALLED RESERVATION FACTORY: ", reservation);
    return $http.post('/api/bookings/new', reservation);
  };

  var getReservations = function (user) {
    return $http.get('/api/bookings', user);
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

  var addPetToUser = function (updatedUser) {
    return $http.post('/api/users/addPet', updatedUser);
  };

  var addReservationToUser = function (reservation) {
    console.log("CALLED RESERVATION TO USER FACTORY: ", reservation);
    return $http.post('/api/users/addReservation', reservation);
  };

  var getPets = function () {
    return $http.get('/api/pets');
  };

  var getUserByEmail = function (userEmail) {
    return $http.post('/api/getUserByEmail/');
  };

  var getUsers = function (user) {
    
    return $http.get('/api/users/', user);
    
  };

  var approveRegistration = function (registrationId) {
    return $http.post('/api/reservations/approveRes/' + 'registrationId' + '/');
  };

  var register = function (data) {
    return $http.post('/api/users/register', data);
  };

  var editUser = function (data) {
    return $http.put('/api/users/', data);
  };

  var banUser = function (userEmail) {
    return $http.delete('/api/toggleBanUser/', userEmail);
  };

  return {
    registrationError: registrationError,
    logIn: logIn,
    logOut: logOut,
    addPet: addPet,
    addPetToUser: addPetToUser,
    addReservationToUser: addReservationToUser,
    getPets: getPets,
    getUserByEmail: getUserByEmail,
    getUsers: getUsers,
    approveRegistration: approveRegistration,
    addReservation: addReservation,
    getReservations: getReservations,
    deleteReservation: deleteReservation, 
    editReservation: editReservation,
    register: register,
    editUser: editUser,
    banUser: banUser
  };

}]);
