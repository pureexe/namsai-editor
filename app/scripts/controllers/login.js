'use strict';

/**
 * @ngdoc function
 * @name namsaiEditorApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the namsaiEditorApp
 */
angular.module('namsaiEditorApp')
  .controller('LoginCtrl', function ($scope,$http,API,$location,localStorageService,$rootScope) {
    $rootScope.title = "LogIn - NAMSAI";
    var action = $location.search().action;
    var user = $location.search().user;
    if(user){
      $scope.clientUsername = user;
    }
    $scope.doLogin = function(){
      $http({
        url: API+'/v1/auth',
        method: "POST",
        data: "username="+$scope.clientUsername+"&password="+$scope.clientPassword,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(response) {
        localStorageService.set("access_token",response.data.access_token);
        localStorageService.set("username",$scope.clientUsername);
        $scope.loginForm.clientPassword.$error.wrongPassword = undefined;
        if(user){
          $location.search({});
          $location.path('/'+$scope.clientUsername+'/settings');
        }else{
          $location.path('/'+$scope.clientUsername);
        }
      },function(response) {
        $scope.loginForm.clientPassword.$error.wrongPassword = true;
      });
    }
  });
