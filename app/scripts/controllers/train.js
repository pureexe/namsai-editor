'use strict';

/**
 * @ngdoc function
 * @name namsaiEditorApp.controller:TrainCtrl
 * @description
 * # TrainCtrl
 * Controller of the namsaiEditorApp
 */
angular.module('namsaiEditorApp')
  .controller('TrainCtrl', function ($scope,$routeParams,localStorageService,API,$http,$mdDialog) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.appname = $routeParams.repo;
    var lastNode,lastParent;
    var currentTopicPosition;
    var currentStoryId;
    /*
    getStoryList
    */
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
    /*
    getStory
    */
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
          if(currentTopicPosition !== 'undefined' && currentTopicPosition != -1){
            $scope.stories[currentTopicPosition].name = $scope.topic.name;
          }
          var addEmptyNext = function(group){
            group.forEach(function(value,index, array){
              if(!value.next){
                array[index].next = [];
              }else{
                addEmptyNext(array[index].next);
              }
            });
          }
          addEmptyNext(response.data.graph);
          console.log(response.data.graph);
          $scope.nodeList = response.data.graph;
        }
      },function(response) {
        console.error(response);
      });
    }
    /*
    deleteStory
    */
    var deleteStory = function(storyId){
      var url = API+'/v1/repos/'+$routeParams.user+'/'+$routeParams.repo+'/stories/'+storyId;
      var token = localStorageService.get("access_token");
      $http({
        url: url,
        method: "DELETE",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: "access_token="+token
      }).then(function(response) {
        if(response.data.id){
          $scope.stories.splice(currentTopicPosition,1);
          $scope.topic = undefined;
          currentStoryId = -1;
          currentTopicPosition = -1;
        }
      },function(response) {
        console.error(response);
      });
    }
    /*
    addStory
    */
    var addStory = function(){
      var url = API+'/v1/repos/'+$routeParams.user+'/'+$routeParams.repo+'/stories';
      var token = localStorageService.get("access_token");
      $http({
        url: url,
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: "access_token="+token
      }).then(function(response) {
        if(response.data.id){
          $scope.stories.unshift(response.data);
          $scope.topic = $scope.stories[0];
          currentTopicPosition = 0;
        }
      },function(response) {
        console.error(response);
      });
    }
    /*
    setStoryName
    */
    var setStoryName = function(storyId,storyName){
      var url = API+'/v1/repos/'+$routeParams.user+'/'+$routeParams.repo+'/stories/'+storyId;
      var token = localStorageService.get("access_token");
      $http({
        url: url,
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: "access_token="+token+"&name="+storyName
      }).then(function(response) {
        if(response.data.id){

        }
      },function(response) {
        console.error(response);
      });
    }
    /*
    getRepoURL
    */
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
    /*
    addNode
    */
    var addNode = function(type,value){
      var url = API+'/v1/repos/'+$routeParams.user+'/'+$routeParams.repo+'/nodes';
      var token = localStorageService.get("access_token");
      $http({
        url: url,
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: "access_token="+token+"&type="+type+"&value="+value+"&story_id="+currentStoryId
      }).then(function(response) {
        if(response.data.id){
          if(lastNode.type == type){
            lastParent.next.push({
              "id":response.data.id,
              "type":type,
              "value":value
            });
            addEdge((lastParent)?lastParent.id:0,response.data.id);
          }else{
            if(!node.next){
              node.next = []
            }
            node.next.push({
              "id":response.data.id,
              "type":type,
              "value":value
            });
            addEdge(lastNode.id,response.data.id);
          }
        }
      },function(response) {
        console.error(response);
      });
    }
    /*
    addEdge
    */
    var addEdge = function(currentId,nextId){
      var url = API+'/v1/repos/'+$routeParams.user+'/'+$routeParams.repo+'/edges';
      var token = localStorageService.get("access_token");
      $http({
        url: url,
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: "access_token="+token+"&current="+currentId+"&next="+nextId
      }).then(function(response) {
        if(response.data.id){
        }
      },function(response) {
        console.error(response);
      });
    }

    var initial = function(){
      getRepo();
      getStoryList();
    }
    initial();
    var setTopicCurrentPosition = function(storyId){
      for(var i=0;i<$scope.stories.length;i++){
        if($scope.stories[i].id == storyId){
          currentTopicPosition = i;
        }
      }
    }
    $scope.chooseTopic = function(storyId){
      currentStoryId = storyId;
      setTopicCurrentPosition(storyId);
      getStory(storyId);
    }
    $scope.topicNameChange = function(){
      $scope.stories[currentTopicPosition].name = $scope.topic.name;
      setStoryName($scope.stories[currentTopicPosition].id,$scope.topic.name);
    }
    $scope.topicDelete = function(storyId){
      var confirm = $mdDialog.confirm()
          .title('Delete?')
          .textContent('Do you want to delete this topic?')
          .ariaLabel('delete')
          .ok('Yes')
          .cancel('No');
      $mdDialog.show(confirm).then(function() {
        deleteStory(storyId)
      }, function() {
      });
    }
    $scope.topicAdd = function(){
      addStory();
    }
    $scope.setLastNode = function(currentNode,parentNode){
      lastNode = currentNode;
      lastParent = parentNode
      //console.log("LASTNODE");
      //console.log(lastNode);
      //console.log("LASTPARENT");
      //console.log(lastParent);
      //console.log("LastNode: "+lastNode.id+" | lastParent"+(parentNode && parentNode.id)?parentNode.id:undefined);
    }
    $scope.addNodePattern = function(){
      //addNode("pattern","test");
      lastNode.next.push({
        "id":999,
        "type":"pattern",
        "value":"sample test",
        "next":[]
      });
      console.log($scope.nodeList);
    }
    $scope.addNodeResponse = function(){
      //addNode("response","test");
      lastParent.next.push({
        "id":999,
        "type":"response",
        "value":"sample response",
        "next":[]
      });
      console.log($scope.nodeList);
    }
    $scope.add = function(data){
    }
    $scope.cs = function(a){
      console.log(a);
    }
  });
