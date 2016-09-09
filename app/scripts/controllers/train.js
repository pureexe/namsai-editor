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
    var currentTopicPosition;
    var getStoryList = function(){
      var getStoryURL = API+'/v1/repos/'+$routeParams.user+'/'+$routeParams.repo+'/stories';
      var token = "";
      if(token = localStorageService.get("access_token")){
        getStoryURL+="?access_token="+token;
      }
      $http({
        url: getStoryURL,
        method: "GET",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(response) {
        if(response.data.stories){
          $scope.stories = response.data.stories;
        }
      },function(response) {
        if(response.status == 404){
          $scope.notFoundRepo = true;
        }
      });
    }
    var getStory = function(storyId){
      var getStoryURL = API+'/v1/repos/'+$routeParams.user+'/'+$routeParams.repo+'/stories/'+storyId;
      var token = "";
      if(token = localStorageService.get("access_token")){
        getStoryURL+="?access_token="+token;
      }
      $http({
        url: getStoryURL,
        method: "GET",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(response) {
        if(response.data.id){
          $scope.topic = response.data;
        }
      },function(response) {
        if(response.status == 404){
          $scope.notFoundRepo = true;
        }
      });
    }
    var getRepo = function(){
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
      },function(response) {
        if(response.status == 404){
          $scope.notFoundRepo = true;
        }
      });
    }
    var initial = function(){
      getRepo();
      getStoryList();
    }
    initial();
    $scope.chooseStory = function(storyId){
      for(var i=0;i<$scope.stories.length;i++){
        if($scope.stories[i].id == storyId){
          currentTopicPosition = i;
        }
      }
      getStory(storyId);
    }
    $scope.topicNameChange = function(){
      $scope.stories[currentTopicPosition].name = $scope.topic.name;
    }
  });
