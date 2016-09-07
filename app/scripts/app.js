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
    'ngTouch',
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
      .when('/train', {
        templateUrl: 'views/train.html',
        controller: 'TrainCtrl',
        controllerAs: 'train'
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
      }).when('/:user', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl',
        controllerAs: 'user'
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
  }).run(function($rootScope,$location){
    $rootScope.gotoPath = function(pathLocation){
      $location.path(pathLocation);
    }
  });
