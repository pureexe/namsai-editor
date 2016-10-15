'use strict';

describe('Controller: RepohistoryCtrl', function () {

  // load the controller's module
  beforeEach(module('namsaiEditorApp'));

  var RepohistoryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepohistoryCtrl = $controller('RepohistoryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepohistoryCtrl.awesomeThings.length).toBe(3);
  });
});
