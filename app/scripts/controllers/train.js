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
    $scope.appname = $routeParams.repo;
    var lastNode,lastParent,lastGrandPa,lastMustDisplay;
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
          if(response.data.graph){
            addEmptyNext(response.data.graph);
          }else{
            response.data.graph = []
          }
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
      value = (value)?value:"";
      var url = API+'/v1/repos/'+$routeParams.user+'/'+$routeParams.repo+'/nodes';
      var token = localStorageService.get("access_token");
      $http({
        url: url,
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: "access_token="+token+"&type="+type+"&value="+value+"&story_id="+currentStoryId
      }).then(function(response) {
        if(response.data.id){
          if(!lastParent){
            $scope.nodeList[$scope.nodeList.length -1].id = response.data.id;
            addEdge(0,response.data.id);
          } else {
            if(lastParent.type == type && lastGrandPa){
              lastGrandPa.next[lastGrandPa.next.length-1].id = response.data.id;
              addEdge((lastGrandPa)?lastGrandPa.id:0,response.data.id);
            }else{
              lastParent.next[lastParent.next.length-1].id = response.data.id;
              addEdge(lastParent.id,response.data.id);
            }
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
    /*
    updateNode
    */
    var updateNode = function(nodeId,value){
      var url = API+'/v1/repos/'+$routeParams.user+'/'+$routeParams.repo+'/nodes/'+nodeId;
      var token = localStorageService.get("access_token");
      $http({
        url: url,
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: "access_token="+token+"&value="+value
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
    $scope.setLastNode = function(currentNode,parentNode,mustDisplay){
      lastGrandPa = lastParent;
      lastNode = currentNode;
      lastParent = parentNode;
      lastMustDisplay = mustDisplay;
    }
    $scope.addNodePattern = function(){
      if(!lastNode){
        $scope.nodeList.push({
            "id":0,
            "type":"pattern",
            "value":"",
            "next":[]
        });
      }else{
        if(lastNode.type == 'pattern'){
          if(!lastParent){
            $scope.nodeList.push({
                "id":0,
                "type":"pattern",
                "value":"",
                "next":[]
            });
          }else{
            lastParent.next.push({
                "id":0,
                "type":"pattern",
                "value":"",
                "next":[]
            });
            if(lastMustDisplay){
              if(lastParent){
                lastMustDisplay[0] = lastParent.next.length -1;
              }else{
                lastMustDisplay[0] = $scope.nodeList.length -1;
              }
              console.log(lastMustDisplay[0]);
            }
          }
        }else{
          lastNode.next.push({
              "id":0,
              "type":"pattern",
              "value":"",
              "next":[]
          });
        }
      }
      addNode('pattern');
    }
    $scope.addNodeResponse = function(){
      if(!lastNode){
        $mdDialog.show(
         $mdDialog.alert()
           .parent(angular.element(document.querySelector('#popupContainer')))
           .clickOutsideToClose(true)
           .title('Pattern node is required!')
           .textContent('You must declare pattern node in begin of the topic')
           .ariaLabel('pattern node is required!')
           .ok('OK')
        );
      }else{
        if(lastNode.type == 'response'){
          lastParent.next.push({
              "id":0,
              "type":"response",
              "value":"",
              "next":[]
          });
          if(lastMustDisplay){
            if(lastParent){
              lastMustDisplay[0] = lastParent.next.length -1;
            }else{
              lastMustDisplay[0] = $scope.nodeList.length -1;
            }
            console.log(lastMustDisplay[0]);
          }
        }else{
          console.log(lastNode);
          lastNode.next.push({
              "id":0,
              "type":"response",
              "value":"",
              "next":[]
          });
        }
        addNode('response');
      }
  }
  $scope.cs = function(a){
    console.log(a);
  }
  $scope.topicUpdateNode = function(nodeId,value){
    updateNode(nodeId,value);
  }
  $scope.topicDeleteNode = function(id,parentNode){
    console.log(id);
    console.log(parentNode);
  }
});
