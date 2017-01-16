'use strict';

/**
 * @ngdoc function
 * @name namsaiEditorApp.controller:RepomessageCtrl
 * @description
 * # RepomessageCtrl
 * Controller of the namsaiEditorApp
 */
angular.module('namsaiEditorApp')
  .controller('RepomessageCtrl', function ($scope,$http,API,$routeParams,localStorageService) {
    var repoMessage = localStorageService.get('repoMessage');
    var lastTimestamp;
    if(repoMessage){
      $scope.messageList = repoMessage.message;
      lastTimestamp = new Date(repoMessage.timestamp);
    }else{
      $scope.messageList = [];
    }
    var reply = function(input,callback){
      var url = API+'/v1/repos/'+$routeParams.repo+'/messages';
      $http({
        url: url,
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: "input="+input
      }).then(function(response) {
        response.data.message.forEach(function(r){
          callback(r);
        })
      },function(response) {
        //console.error(response);
        callback(response.data.error.message);
      });
    }
    var getDateText = function(){
      var hour = date.getHours();
      var minute = +date.getMinutes();
      hour = (hour<10)?'0'+hour:hour;
      minute = (minute<10)?'0'+minute:minute;
      var out = ''+date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+hour+':'+minute;
      return out;
    }
    $scope.input = function(value){
      if(!lastTimestamp || (new Date() - lastTimestamp)/1000 > 300){
        var date = new Date();
        $scope.messageList.push({"type":"time","value":getDateText()});
      }
      $scope.messageList.push({"type":"user","value":value});
      $scope.inputText = '';
      reply(value,function(value){
        $scope.messageList.push({"type":"bot","value":value});
        localStorageService.set('repoMessage',{timestamp:new Date(),message:$scope.messageList});
      })
    }
  }).directive('myEnter', function () {
      return function (scope, element, attrs) {
          element.bind("keydown keypress", function (event) {
              if(event.which === 13) {
                  scope.$apply(function (){
                      scope.$eval(attrs.myEnter);
                  });
                event.preventDefault();
              }
          });
      };
  });
