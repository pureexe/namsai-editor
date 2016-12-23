'use strict';

describe('Controller: ReponewCtrl', function () {

  // load the controller's module
  beforeEach(module('namsaiEditorApp'));

  var ReponewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReponewCtrl = $controller('ReponewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReponewCtrl.awesomeThings.length).toBe(3);
  });
});
