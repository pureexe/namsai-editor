'use strict';

/**
 * @ngdoc function
 * @name namsaiEditorApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the namsaiEditorApp
 */
angular.module('namsaiEditorApp')
  .controller('SignupCtrl', function ($scope,$http) {
    $scope.doSignup = function(){
      var url = API+'/v1/users/';
      $http({
        url: url,
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: "access_token="+token
      }).then(function(response) {
        console.log(response);
      },function(response) {
        console.error(response);
      });
    }
  });
