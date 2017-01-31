'use strict';

/**
 * @ngdoc overview
 * @name namsaiEditorApp
 * @description
 * # namsaiEditorApp
 *
 * Main module of the application.
 */
angular
  .module('namsaiEditorApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
//  'ngTouch',
    'ngMaterial',
    'ngMessages',
    'LocalStorageModule',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup'
      })
      .when('/:user', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl',
        controllerAs: 'user'
      })
      .when('/apps/new', {
        templateUrl: 'views/reponew.html',
        controller: 'ReponewCtrl',
        controllerAs: 'repoNew'
      })
      .when('/:user/settings', {
        templateUrl: 'views/usersettings.html',
        controller: 'UsersettingsCtrl',
        controllerAs: 'userSettings'
      })
      .when('/:user/:repo', {
        templateUrl: 'views/train.html',
        controller: 'TrainCtrl',
        controllerAs: 'train'
      })
      .when('/:user/:repo/settings', {
        templateUrl: 'views/reposettings.html',
        controller: 'ReposettingsCtrl',
        controllerAs: 'repoSettings'
      })
      .when('/:user/:repo/messages', {
        templateUrl: 'views/repomessage.html',
        controller: 'RepomessageCtrl',
        controllerAs: 'repoMessage'
      })
      .when('/:user/:repo/dashboard', {
        templateUrl: 'views/repodashboard.html',
        controller: 'RepodashboardCtrl',
        controllerAs: 'repoDashboard'
      })
      .when('/:user/:repo/history', {
        templateUrl: 'views/repohistory.html',
        controller: 'RepohistoryCtrl',
        controllerAs: 'repoHistory'
      })
      .otherwise({
        templateUrl: 'views/status404.html',
        controller: 'Status404Ctrl',
        controllerAs: 'status404'
      });
  }).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('light-blue');
  }).config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('namsaiEditorApp')
      .setNotify(true, true)
  }).run(function($rootScope,$location,$mdDialog){
    $rootScope.gotoPath = function(pathLocation){
      $location.path(pathLocation);
    }
    $rootScope.gotoBack = function(){
      window.history.back();
    }
    $rootScope.DialogConnectFailed = function(){
      var cfd = $mdDialog.alert()
          .title('Connect failed!')
          .textContent('please check your internet connectivity and refresh this page.')
          .ariaLabel('Connect failed')
          .ok('Yes');
      $mdDialog.show(cfd).then(function() {
      }, function() {
      });
    }
  });
