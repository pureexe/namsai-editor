'use strict';

/**
 * @ngdoc function
 * @name namsaiEditorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the namsaiEditorApp
 */
angular.module('namsaiEditorApp')
  .controller('MainCtrl', function ($rootScope,$location) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });