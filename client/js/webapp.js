angular.module('todo-webapp', ['todo-api', 'ngAnimate'])
	.controller('main', ['$scope', 'api', function ($scope, api) {
		var emptyItem = {
			_id: null,
			finished: false,
			archived: false,
			entry: ""
		};

		$scope.newItem = angular.copy(emptyItem);

		$scope.add = function () {
			if (!$scope.newItem.entry) return; // TODO: Fix this.

			api.createItem($scope.newItem)
				.success(function (result) {
					$scope.items.push(result.data);
					$scope.newItem = angular.copy(emptyItem);
					console.log("Added!");
				})
				.error(function (error) {
					console.log("Oh dang.", error);
				});
		};

		$scope.finish = function (item) {
			console.log("Finished ", item._id);
			item.finished = !item.finished;

			api.updateItem(item)
				.success(function (result) {

				})
				.error(function (error) {
					console.log("Oh dang.", error);
				});				
		};

		$scope.delete = function (id) {
			console.log("Deleted ", id);

			api.deleteItem(id)
				.success(function (result) {
					// filter the item out of our array.
					console.log(result);
					$scope.items = $scope.items.filter(function (elm) {
						return elm._id !== result.data;
					});
				})
				.error(function (error) {
					console.log("Oh dang.", error);
				});
		}

		api.getItems()
			.success(function (result) {
				$scope.items = result.data;
			})
			.error(function (error) {
				console.log("Uh-oh.", error);
			});
	}]);