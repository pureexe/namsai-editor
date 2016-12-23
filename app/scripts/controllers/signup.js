'use strict';

/**
 * @ngdoc function
 * @name namsaiEditorApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the namsaiEditorApp
 */
angular.module('namsaiEditorApp')
  .controller('SignupCtrl', function ($scope,$http,API,$rootScope) {
    $rootScope.title = "SignUp - NAMSAI";
    $scope.doSignup = function(){
      var username = $scope.clientUsername;
      var email = $scope.clientEmail;
      var password = $scope.clientPassword;
      var url = API+'/v1/users';
      $http({
        url: url,
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: "username="+username+"&password="+password+"&email="+email
      }).then(function(response) {
        $location.path('/login?user='+username);
      },function(response) {
        var code = response.data.error.code;
        if(code == 5){
          $scope.signupForm.clientEmail.$error.alreadyExist = true;
        } else if (code == 6){
          $scope.signupForm.clientUsername.$error.alreadyExist = true;
        } else if (code == 7){
          $scope.signupForm.clientUsername.$error.isReserved = true;
        }else{
          console.error(response);
        }
      });
    }
    $scope.usernameChange = function(){
      if($scope.signupForm.clientUsername.$error.alreadyExist){
        $scope.signupForm.clientUsername.$error.alreadyExist = false;
      }
      if($scope.signupForm.clientUsername.$error.isReserved){
        $scope.signupForm.clientUsername.$error.isReserved = false;
      }
    }
    $scope.emailChange = function(){
      if($scope.signupForm.clientEmail.$error.alreadyExist){
        $scope.signupForm.clientEmail.$error.alreadyExist = false;
      }
    }
  });
