'use strict';

require('../../vendor/angular/angular');
require('../../vendor/angular-ui-router/release/angular-ui-router');
require('../../vendor/angular-ui-utils/modules/route/route');
require('../../build/templates');

var home = require('./home/home');
var about = require('./about/about');

angular.module( 'ngBoilerplate', [
  home.name,
  about.name,
  'ui.state',
  'ui.route'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
    }
  });

  $scope.navClass = "nav__hidden";

  $scope.toggleNavClass = function(){
    
    if ($scope.navClass === "nav__hidden") {
      $scope.navClass = "nav__visible";
    }
    else {
      $scope.navClass = "nav__hidden";
    }

  };
});

