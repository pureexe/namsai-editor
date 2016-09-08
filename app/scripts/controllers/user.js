'use strict';

/**
 * @ngdoc function
 * @name namsaiEditorApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the namsaiEditorApp
 */
angular.module('namsaiEditorApp')
  .controller('UserCtrl', function (API,$http,$routeParams,$scope,localStorageService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var initial = function(){
      var username = $routeParams.user;
      $http({
        url: API+'/v1/users/'+username,
        method: "GET",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(response) {
        $scope.user.name = response.data.name;
        $scope.user.bio = response.data.bio;
        $scope.user.username = response.data.username;
      },function(response) {
        if(response.status == 404){
          $scope.notFoundUser = true;
        }
      });
      var getRepoURL = API+'/v1/users/'+username+'/repos';
      var token = "";
      if(token = localStorageService.get("access_token")){
        getRepoURL+="?access_token="+token;
      }
      $http({
        url: getRepoURL,
        method: "GET",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(response) {
        $scope.repos = response.data;
      },function(response) {
        if(response.status == 404){
          $scope.notFoundUser = true;
        }
      });
    };
    initial();
  });
