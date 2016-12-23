'use strict';

/**
 * @ngdoc function
 * @name namsaiEditorApp.controller:ReponewCtrl
 * @description
 * # ReponewCtrl
 * Controller of the namsaiEditorApp
 */
angular.module('namsaiEditorApp')
  .controller('ReponewCtrl', function ($rootScope,$scope,localStorageService,$http,API,$location) {
    $rootScope.title = 'create new app - NAMSAI';
    $scope.doNewRepo = function(){
      $http({
          url: API+'/v1/repos',
          method: "POST",
          data: "name="+$scope.repoName+"&description="+$scope.repoDescription+"&access_token="+localStorageService.get("access_token"),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(response) {
            $location.path('/'+localStorageService.get("username"));
        },function(response) {
          var code = response.data.error.code;
          $scope.repoForm.repoName.$error.alreadyExist = true;
        });
    }
});
