module.exports = function HomeController($scope) {

    $scope.page = 1;

    $scope.nextPage = function() {
        $scope.page = 2;
    };

    $scope.previousPage = function() {
        $scope.page = 1;
    };

};