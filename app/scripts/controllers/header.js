'use strict';

/**
 * @ngdoc function
 * @name namsaiEditorApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the namsaiEditorApp
 */
angular.module('namsaiEditorApp')
  .controller('HeaderCtrl', function ($scope,localStorageService,$rootScope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var logout = function(){
      localStorageService.remove('access_token');
      localStorageService.remove('username');
      $scope.login = undefined;
    }
    $rootScope.doLogout = function(){
      doLogout();
    }
    if(localStorageService.get('access_token')){
      $scope.login = true;
      $scope.username = localStorageService.get('username');
    }
  });
