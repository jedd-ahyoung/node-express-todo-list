angular.module('todo-webapp', ['todo-api', 'ngAnimate', 'ngStorage'])
	.controller('main', ['$scope', '$document', '$timeout', '$localStorage', '$window', 'api', function ($scope, $document, $timeout, $localStorage, $window, api) {
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
					console.log("Added!", $document);
					$timeout(function () {
						$window.scrollTo(0, $document[0].body.scrollHeight);
					}, 0);
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
		};

		/* Do stuff with localstorage. */

		// First, load the items from localstorage into our array, if it exists.
		$localStorage.items = $localStorage.items || {};
		$scope.items = [];

		api.getItems()
			.success(function (result) {
				// Add the items into our localstorage hash. TODO: Wrap this in a service.
				result.data.forEach(function (value) {
					// Here, merge the items. If new value has greater updated date, overwrite.
					if (!$localStorage.items[value._id] ||
						$localStorage.items[value._id].updated < value.updated) 
					{
						$localStorage.items[value._id] = value;
					}
				});

				// Temporary workaround for sorting issue. Sort by create date. TODO: Wrap this in a service.
				Object.keys($localStorage.items).forEach(function (value) {
					$scope.items.push($localStorage.items[value]);
				});
			})
			.error(function (error) {
				// Data didn't load. For now, temporarily make items empty in memory.
				$scope.items = [];
				console.log("Error loading items from db: ", error);
			});
	}]);