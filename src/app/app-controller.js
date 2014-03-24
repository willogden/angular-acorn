module.exports = function($scope, $location) {

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if (angular.isDefined(toState.data.pageTitle)) {
            $scope.pageTitle = toState.data.pageTitle + ' | angularAcornApp';
        }
    });

    $scope.navClass = "nav__hidden";

    $scope.toggleNavClass = function() {

        if ($scope.navClass === "nav__hidden") {
            $scope.navClass = "nav__visible";
        } else {
            $scope.navClass = "nav__hidden";
        }

    };
    
};