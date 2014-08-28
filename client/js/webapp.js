angular.module('todo-webapp', ['todo-api'])
	.controller('main', ['$scope', 'apiMock', function ($scope, api) {
		var emptyItem = {
			_id: null,
			finished: false,
			archived: false,
			entry: ""
		};

		$scope.newItem = angular.copy(emptyItem);

		$scope.add = function () {
			$scope.items.push(angular.copy($scope.newItem));
			$scope.newItem = angular.copy(emptyItem);
			console.log("Added!");
		};

		$scope.finish = function (id) {
			console.log("Finished ", id);
		};

		$scope.delete = function (id) {
			console.log("Deleted ", id);
		}

		api.getItems()
			.success(function (result) {
				$scope.items = result;
			})
			.error(function (error) {
				console.log("Uh-oh.", error);
			});
	}]);