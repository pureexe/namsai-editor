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
    'ngTouch'
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
      .otherwise({
        redirectTo: '/'
      });
  });
