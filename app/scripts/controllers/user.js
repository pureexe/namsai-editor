'use strict';

/**
 * @ngdoc function
 * @name namsaiEditorApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the namsaiEditorApp
 */
angular.module('namsaiEditorApp')
  .controller('UserCtrl', function (API,$http,$routeParams,$scope) {
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
        console.log(response);
        $scope.user.name = response.data.name;
        $scope.user.bio = response.data.bio;
        $scope.user.username = response.data.username;
      },function(response) {
      });
    };
    initial();
  });
