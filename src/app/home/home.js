'use strict';

module.exports = angular.module('angularAcornApp.home', [
  'home/home.tpl.html',
  'ui.state'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
})
.controller( 'HomeCtrl', function HomeController( $scope ) {

    $scope.page = 1;
    
    $scope.nextPage = function(){
      console.log("ok");
      $scope.page = 2;
    };

    $scope.previousPage = function(){
      $scope.page = 1;
    };
  
});

