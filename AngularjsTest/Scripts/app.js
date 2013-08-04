var TodoApp = angular.module("TodoApp", ["ngResource"]).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', { controller: ListCtrl, templateUrl: 'list.html' }).
            otherwise({ redirectTo: '/' });
    });

TodoApp.factory('Todo', function ($resource) {
    return $resource('/api/todo/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

var ListCtrl = function ($scope, $location, Todo) {

    $scope.search = function () {
        Todo.query({
            q: $scope.query,
            sort: $scope.sort_order,
            desc: $scope.is_desc,
            limit: $scope.limit,
            offset: $scope.offset
            },
        function (data) {
            $scope.more = data.length === $scope.limit;
            $scope.items = $scope.items.concat(data);
        });
     };

    $scope.sort = function (col) {
        if ($scope.sort_order === col) {
            $scope.is_desc = !$scope.is_desc;
        } else {
            $scope.sort_order = col;
            $scope.is_desc = false;
        }
        $scope.reset();
    };

    $scope.show_more = function() {
        $scope.offset += $scope.limit;
        $scope.search();
    }
    
    $scope.has_more = function() {
        return $scope.more;
    }

    $scope.reset = function() {
        $scope.limit = 4;
        $scope.offset = 0;
        $scope.items = [];
        $scope.more = true;

        $scope.search();
    }
    
    // default value     
    $scope.sort_order = "Priority";
    $scope.is_desc = true;
    
    $scope.reset();

};