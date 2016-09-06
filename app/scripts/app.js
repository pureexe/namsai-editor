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
      .when('/user', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl',
        controllerAs: 'user'
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
      .otherwise({
        redirectTo: '/'
      });
  }).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('light-blue');
  }).run(function($rootScope,$location){
    $rootScope.gotoPath = function(pathLocation){
      $location.path(pathLocation);
    }
  });
