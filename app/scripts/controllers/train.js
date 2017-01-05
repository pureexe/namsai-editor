'use strict';

/**
 * @ngdoc function
 * @name namsaiEditorApp.controller:TrainCtrl
 * @description
 * # TrainCtrl
 * Controller of the namsaiEditorApp
 */
angular.module('namsaiEditorApp')
  .controller('TrainCtrl', function ($scope,$routeParams,localStorageService,API,$http,$mdDialog,$rootScope) {
    $scope.appName = $routeParams.repo;
    $scope.appPath = $routeParams.user+'/'+$routeParams.repo;
    $rootScope.title = $scope.appPath;
    var lastNode,lastParent,lastGrandPa,lastMustDisplay; //TODO: Need to find way fix must display
    var stackDisplay = {"depth":0};
    var currentTopicPosition;
    var currentStoryId;
    $scope.debugNode = function(a){
      console.log($scope.nodeList);
    }
    $scope.cs = function(a){
      console.log(a);
    }
    /**
    * getStoryList run on initial for get storylist in leftbar
    **/
    var getStoryList = function(){
      var getStoryURL = API+'/v1/repos/'+$routeParams.repo+'/stories';
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
    /**
    * getStory That click on left panel
    **/
    var getStory = function(storyId){
      var getStoryURL = API+'/v1/repos/'+$routeParams.repo+'/stories/'+storyId;
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
          $scope.nodeList = response.data.graph;
        }
      },function(response) {
        console.error(response);
      });
    }
    /**
    *deleteStory
    **/
    var deleteStory = function(storyId){
      //Remove story from UI
      $scope.stories.splice(currentTopicPosition,1);
      $scope.topic = undefined;
      currentStoryId = -1;
      currentTopicPosition = -1;
      //Remove story from Backend
      var url = API+'/v1/repos/'+$routeParams.repo+'/stories/'+storyId;
      var token = localStorageService.get("access_token");
      $http({
        url: url,
        method: "DELETE",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: "access_token="+token
      }).then(function(response) {

      },function(response) {
        console.error(response.data);
      });
    }
    /*
    addStory
    */
    var addStory = function(){
      var url = API+'/v1/repos/'+$routeParams.repo+'/stories';
      var token = localStorageService.get("access_token");
      $http({
        url: url,
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: "access_token="+token
      }).then(function(response) {
        if(response.data.id){
          $scope.nodeList = {}
          $scope.stories.unshift(response.data);
          $scope.topic = $scope.stories[0];
          currentTopicPosition = 0;
        }
      },function(response) {
        console.error(response);
      });
    }
    /**
    *setStoryName
    **/
    var setStoryName = function(storyId,storyName){
      var url = API+'/v1/repos/'+$routeParams.repo+'/stories/'+storyId;
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
    /**
    *getRepoURL: use to check is this repo exist or 404 ?
    **/
    var getRepo = function(){
      var getRepoURL = API+'/v1/repos/'+$routeParams.repo;
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
    var setTopicCurrentPosition = function(storyId){
      for(var i=0;i<$scope.stories.length;i++){
        if($scope.stories[i].id == storyId){
          currentTopicPosition = i;
        }
      }
    }
    $scope.chooseTopic = function(storyId){
      lastGrandPa = undefined;
      lastNode = undefined;
      lastParent = undefined;
      stackDisplay = {"depth":0};
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
  /**
  addNode: RestAPI to add node in backend
  **/
  var addNode = function(parentId,type,callback){
    var token = localStorageService.get("access_token");
    $http({
      url: API+'/v1/repos/'+$routeParams.repo+'/nodes',
      method: "POST",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: 'type='+type+'&story_id='+$scope.topic.id+'&access_token='+token
    }).then(function(response) {
      if(response.data.id){
        var nodeId = response.data.id;
        callback(nodeId);
        addEdge(parentId,nodeId,function(edgeId){
        });
      }else{
        console.error('addNode: no id receive');
      }
    },function(response) {
      console.error(response);
    });
  }
  /**
  addEdge: RestAPI to add edge in backend
  **/
  var addEdge = function(from,to,callback){
    var token = localStorageService.get("access_token");
    $http({
      url:  API+'/v1/repos/'+$routeParams.repo+'/edges',
      method: "POST",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: "current="+from+"&next="+to+"&access_token="+token
    }).then(function(response) {
      console.log(response.data)
      if(response.data.id){
        callback(response.data.id)
      }else{
        console.error('addNode: no id receive');
      }
    },function(response) {
      console.error(response);
    });
  }
  /**
  * updateNode: RestAPI to Update backend
  **/
  var updateNode = function(nodeId,value){
    var url = API+'/v1/repos/'+$routeParams.repo+'/nodes/'+nodeId;
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
  /**
  * deleteNode: RestAPI to delete backend
  **/
  var deleteNode = function(nodeId){
    var url = API+'/v1/repos/'+$routeParams.repo+'/nodes/'+nodeId;
    var token = localStorageService.get("access_token");
    $http({
      url: url,
      method: "DELETE",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: "access_token="+token
    }).then(function(response) {
      console.log(response.data);
      if(response.data.id){

      }
    },function(response) {
      console.error(response);
    });
  }
  /**
  * findLastNode
  * @internal
  **/
  var findLastNode = function(){
    var root = $scope.nodeList;
    var parent = undefined;
    var head = root;
    while(head.nodes && head.nodes.length != 0 ){
      parent = head;
      var view = (head.view)?head.view:0;
      head = head.nodes[view];
    }
    head.parent = parent;
    return head;
  }
  /**
  * TopicAddNode
  **/
  $scope.topicAddNode = function(type){
    var parentId = 0,fallbackObj = undefined;
    lastNode = findLastNode();
    if(!lastNode.data || lastNode.data.type != type){
      lastNode.nodes = [
        {
          "data":{
            "type":type,
            "value":"",
          }
        }
      ]
      fallbackObj = lastNode.nodes[0];
      parentId = (lastNode.data)?lastNode.data.id:0;
    }else{
      if(!lastNode.parent.nodes){
        lastNode.parent.nodes = [];
      }
      lastNode.parent.view = lastNode.parent.nodes.length;
      lastNode.parent.nodes.push({
        "data":{
          "type":type,
          "value":""
        }
      });
      fallbackObj = lastNode.parent.nodes[lastNode.parent.nodes.length -1];
      parentId = (lastNode.parent.data)?lastNode.parent.data.id:0;
    }
    //Need to remove this it just for debug
    if(type == 'variable')return;
    if(type == 'condition')return;
    if(type == 'webhook')return;
    if(type == 'bookmark_entry')return;
    if(type == 'bookmark_jump')return;
    addNode(parentId,type,function(nodeId){
      fallbackObj.data.id = nodeId;
    });
  }
  /**
  * topicUpdateNode: on node change callback from ui
  **/
  $scope.topicUpdateNode = function(nodeId,nodeValue){
    updateNode(nodeId,nodeValue)
  }
  /**
  * topicDeleteNode: on node click delete callback from ui
  **/
  $scope.topicDeleteNode = function(node,parentNode){
    var i = 0;
    for(i=0;i<parentNode.nodes.length;i++){
      if(parentNode.nodes[i].data.id == node.data.id){
        deleteNode(node.data.id);
        parentNode.nodes.splice(i,1);
        parentNode.view = (i==0)?0:i-1;
        break;
      }
    }
  }
  var initial = function(){
    getRepo();
    getStoryList();
  }
  /**
  * run on initial
  **/
  initial();
});
