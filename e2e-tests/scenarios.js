'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /main when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/main");
  });


  describe('viewAbout', function() {

    beforeEach(function() {
      browser.get('index.html#/viewAbout');
    });


    it('should render viewAbout when user navigates to /viewAbout', function() {
      expect(element.all(by.css('[ng-view] a')).first().getText()).
        toMatch('Go Back');
    });

  });


});
