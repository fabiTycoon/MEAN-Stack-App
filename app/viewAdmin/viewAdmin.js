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
    viewUsersPets: false,
    viewUsersReservations: false,
    viewReservations: false,
    viewPets: false,
    viewData: false
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
    $scope.loadedUser = {};

      //TO DO: REFACTOR TO DEFAULT STATE FN:
      $scope.adminViewModelState.viewUsersReservations = false;
      $scope.adminViewModelState.viewUsersPets = false;


    $scope.userLoaded = false;
    var query = {'email': userEmail};

    User.getUserByEmail(query)
      .then(function (res, user) {
          console.log("FOUND USER: ", res.data);
          console.log("USER? ", user);

        if (res.data.success === true) {
          $scope.loadedUser = res.data.user;
          $scope.userLoaded = true;       

          if (dataType === 'reservations') {
            $scope.adminViewModelState.viewUsersReservations = true;
          } else if (dataType === 'pets') {
            $scope.adminViewModelState.viewUsersPets = true;
          };
        } else {
          $rootScope.registrationError = "Failed to load user, please try again."
          $rootScope.$broadcast('registrationError');
        };
      })
  };

  $scope.loadUserReservations = function (userEmail) {
    loadUser(userEmail, 'reservations');
  };

  $scope.loadUserPets = function (userEmail) {
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