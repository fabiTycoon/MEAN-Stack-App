'use strict';

describe('myApp.viewAbout module', function() {
  //using module fn provided by angular mocks; loads given module for testing
  beforeEach(module('myApp.viewAbout'));

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('viewAbout controller', function(){

    var $controller;

    it('should exist', inject(function($controller) {
      var ViewAboutCtrl = $controller('ViewAboutCtrl');
      expect(ViewAboutCtrl).toBeDefined();
    }));

  });

  describe('$scope.selector', function(){
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('ViewAboutCtrl', { $scope: $scope });
    });

      it('should select the correct item', function($scope){
        $scope.selector('team');
        expect($scope.select.team).toEqual(true); 
      });

      it('should allow only one item to be selected', function(){
        var trueCount = 0;
        for (var selectorKey in $scope.select) {
          if ($scope.select[selectorKey] === true) {
            trueCount++;
          }
        }
        expect(trueCount).toEqual(1);
      });
  });

});