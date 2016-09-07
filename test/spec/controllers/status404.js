'use strict';

describe('Controller: Status404Ctrl', function () {

  // load the controller's module
  beforeEach(module('namsaiEditorApp'));

  var Status404Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Status404Ctrl = $controller('Status404Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(Status404Ctrl.awesomeThings.length).toBe(3);
  });
});
