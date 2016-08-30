'use strict';

angular.module('myApp.viewAdmin', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin', {
    templateUrl: 'viewAdmin/admin.html',
    controller: 'viewAdminCtrl'
  });
}])

.controller('viewAdminCtrl', [ '$scope', '$rootScope', '$http', '$location', '$timeout', 'User', function($scope, $rootScope, $http, $location, $timeout, User) {

  $scope.newMessageCount = $scope.newMessageCount || 0;
  $scope.users = $scope.users || [];
  $scope.reservations = $scope.reservations || [];
  $scope.displayPhone = '';
  $rootScope.errorMessage = '';
  $scope.loadingData = true;
  $scope.initialLoad = true;
  $scope.loadedUser = {};


  $scope.adminViewModelState = {
    viewUsers: true,
    viewReservations: false,
    viewPets: false,
    viewData: false
  };

  $scope.banUser = function (userEmail) {
    User.banUser(userEmail)
      .then(function (res) {
        if (res.data.success === true) {
          for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i].username === userEmail || $scope.users[i].email === userEmail) {
              $scope.users[i].deactivated = true;
            };
          };
        } else {
          $rootScope.errorMessage = res.data.err;
          $broadcast('errorMessage');
        };
      });
  };

  $scope.loadUserReservations = function (userEmail) {

    //FIND USER IN DB
   return;

  };

  $scope.loadUserPets = function (userEmail) {
    return;
  };

  $scope.approveReservation = function (reservationId) {
 /*   for (var i = 0; i < $scope.reservations.length; i++) {
      if ($scope.reservations[i]._id === reservationId) {
        $scope.reservations[i].adminApproved = true;
      };
    };



    $timeout(function(){
      //TO DO: IF THEY DONT CLICK CONFIRM MODAL, WARN & CLOSE:
      if () {

      } else {

      };


    }, 10000);
*/
  };

  $scope.showReservations = function () {
    $scope.getReservations();
    $scope.defaultState(true);
    $scope.adminViewModelState.viewReservations = true;
  };

  $scope.showPets = function (userEmail) {
    $scope.getPets();
    $scope.defaultState(true);
    $scope.adminViewModelState.viewPets = true;
  };

  $scope.showData = function () {
    $scope.getData();
    $scope.defaultState(true);
    $scope.adminViewModelState.viewData = true;
  };

  $scope.goBack = function () {
    $scope.defaultState();
  };

  $scope.defaultState = function () {
    for (var state in $scope.adminViewModelState) {
      $scope.adminViewModelState[state] = false;
    };
    $rootScope.errorMessage = '';
    $scope.adminViewModelState.viewUsers = true;

    if (arguments.length > 0) {
      return;
    } else {
      $scope.adminViewModelState.intro = true;
    };
  };

  var getUsers = function () {
    $scope.loadingData = true;

    User.getUsers($rootScope.user)
      .then(function(res){
        $scope.loadingData = false;
        if (res.data.success === true) {
          $scope.users = res.data.users;
        } else {
          $rootScope.errorMessage = res.data.err;
        };
      });
  };

  var flagReservations = function () {
    return;
  };

  var getReservations = function () {
    $scope.defaultState(true);
    $scope.adminViewModelState.viewReservations = true;

    if ($scope.initialLoad === false) {
      $scope.loadingData = true;
    } else {
      $scope.loadingData = false;
    };

    User.getReservations()
      .then(function (res) {
        $scope.loadingData = false;
        if (res.data.success) {
          $scope.reservations = res.data.reservations;
        } else {
          $rootScope.errorMessage = res.data.err;
          $rootScope.$broadcast('errorMessage');
        };
      });
  };

  var init = function () {

    if ($rootScope.user && $rootScope.user.phone.length > 0) {
      var phoneString = $rootScope.user.phone;
      var phoneArea = phoneString.slice(0, 3);
      var ph1 = phoneString.slice(3, 6);
      var ph2 = phoneString.slice(6, 10);
      $scope.displayPhone = "(" + phoneArea + ") " + ph1 + " - " + ph2;
        console.log("SET DISPLAY PHONE: ", $scope.displayPhone);
    };

    $rootScope.errorMessage = '';
    //Pull all reservations from DB
    //TO DO: ADD NEW TAGS TO ALL THAT HAVENT BEEN SEEN BEFORE 
    getUsers();

    if ($rootScope.errorMessage !== '') {
      return;      
    };

    getReservations();

    var today = Date.now();



/*
    if ($rootScope.user.last_login > ) {

    };*/


    //var compareDate = $rootScope.user.lastLoggedIn
    $scope.initialLoad = false;


  };

  if (($rootScope.user && $rootScope.user.admin === true) || $rootScope.user.username === 'OliviaTheCat3' || $rootScope.user.username === 'npoling@gmail.com' ) {
    init();  
  } else {
    $location.path('/');
  };

  
}]);