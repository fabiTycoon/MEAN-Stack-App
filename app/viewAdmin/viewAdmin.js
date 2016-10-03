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
  $scope.loadingData = false;
  $scope.initialLoad = true;
  $scope.userLoaded = false;
  $scope.loadedUser = {};

  $scope.adminViewModelState = {
    viewUsers: true, 
    viewReservations: false,
    viewPets: false,
    viewData: false
  };

  $scope.defaultState = function () {

    for (var i = 0; i < $scope.users.length; i++) {
      $scope.users[i].showingPets = false;
      $scope.users[i].showingReservations = false;
    };

    for (var state in $scope.adminViewModelState) {
      $scope.adminViewModelState[state] = false;
    };
    $rootScope.errorMessage = '';

    if (arguments.length > 0) {
      return;
    } else {
      $scope.adminViewModelState.viewUsers = true;
    };
  };



  var getUsers = function () {
    $scope.loadingData = true;

      console.log("FN: ", User.getUsers);

    User.getUsers($rootScope.user)
      .then(function (res) {
        $scope.loadingData = false;

        if (res.data.success === true) {
          $scope.users = res.data.users;

          for (var i = 0; i < $scope.users.length; i++) {
            $scope.users[i].showingPets = false;
            $scope.users[i].showingReservations = false;
            var phoneString = $scope.users[i].phone;
            var phoneArea = phoneString.slice(0, 3);
            var ph1 = phoneString.slice(3, 6);
            var ph2 = phoneString.slice(6, 10);
            $scope.users[i].displayPhone = "(" + phoneArea + ") " + ph1 + " - " + ph2;
          };
            console.log("SET USERS: ", $scope.users);
        } else {
          $rootScope.errorMessage = res.data.err;
        };
      });
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

  var loadUser = function (userEmail, dataType) {
      //TO DO: REFACTOR TO DEFAULT STATE FN:

      console.log("CALLED LOAD USER: ", userEmail, dataType);

    for (var i = 0; i < $scope.users.length; i++) {
      if ($scope.users[i].email === userEmail) {
        if (dataType === 'pets') {
          $scope.users[i].showingPets = true;
        } else if (dataType === 'reservations') {
          $scope.users[i].showingReservations = true;
        };
      } else {
          //TO DO - MAY WANT TO CHANGE THIS SO YOU CAN LOAD MORE THAN ONE USER AT ONCE
        $scope.users[i].showingReservations = false;
        $scope.users[i].showingPets = false;
      };
    };
  };

  $scope.loadUserReservations = function (userEmail) {
      console.log("CALLED loadUserReservations: ", userEmail);
    loadUser(userEmail, 'reservations');
  };

  $scope.loadUserPets = function (userEmail) {
      console.log("CALLED loadUserPets: ", userEmail);
    loadUser(userEmail, 'pets');
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
    getReservations();
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

  


  var flagReservations = function () {
    return;
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
    //var compareDate = $rootScope.user.lastLoggedIn
    $scope.initialLoad = false;
    for (var key in $scope.adminViewModelState) {$scope.adminViewModelState[key] = false};
    $scope.adminViewModelState.viewUsers = true;
  };

  console.log("USER: ", $rootScope.user);

  if (($rootScope.user && $rootScope.user.admin === true) || ($rootScope.user && ($rootScope.user.email === 'OliviaTheCat3' || $rootScope.user.username === 'OliviaTheCat3')) || ($rootScope.user && $rootScope.user.email === 'npoling@gmail.com') ) {
    init();  
  } else {
    $location.path('/');
  };

  
}]);