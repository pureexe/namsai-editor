'use strict';

/**
 * @ngdoc function
 * @name namsaiEditorApp.controller:TrainCtrl
 * @description
 * # TrainCtrl
 * Controller of the namsaiEditorApp
 */
angular.module('namsaiEditorApp')
  .controller('TrainCtrl', function ($scope,$routeParams,localStorageService,API,$http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.appname = $routeParams.repo;
    var initial = function(){
      var getRepoURL = API+'/v1/repos/'+$routeParams.user+'/'+$routeParams.repo;
      var token = "";
      if(token = localStorageService.get("access_token")){
        getRepoURL+="?access_token="+token;
      }
      $http({
        url: getRepoURL,
        method: "GET",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(response) {
        console.log(response);
      },function(response) {
        if(response.status == 404){
          $scope.notFoundRepo = true;
        }
      });
    }
    initial();
  });
