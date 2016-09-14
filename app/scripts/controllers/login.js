'use strict';

/**
 * @ngdoc function
 * @name namsaiEditorApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the namsaiEditorApp
 */
angular.module('namsaiEditorApp')
  .controller('LoginCtrl', function ($scope,$http,API,$location,localStorageService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.doLogin = function(){
      console.log("DO LOGIN");
      $http({
        url: API+'/v1/auth',
        method: "POST",
        data: "username="+$scope.clientUsername+"&password="+$scope.clientPassword,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(response) {
        localStorageService.set("access_token",response.data.access_token);
        localStorageService.set("username",$scope.clientUsername);
        $scope.loginForm.clientPassword.$error.wrongPassword = undefined;
        $location.path('/'+$scope.clientUsername);
      },function(response) {
        $scope.loginForm.clientPassword.$error.wrongPassword = true;
      });
    }
  });
