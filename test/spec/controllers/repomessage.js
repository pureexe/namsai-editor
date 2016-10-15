'use strict';

describe('Controller: RepomessageCtrl', function () {

  // load the controller's module
  beforeEach(module('namsaiEditorApp'));

  var RepomessageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepomessageCtrl = $controller('RepomessageCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepomessageCtrl.awesomeThings.length).toBe(3);
  });
});
