angular.module('todo-api', [])
	.factory('apiMock', function ($q) {
		console.log('Q!', $q);
		function addHttpMethods (promise) {
			// Add the .success and .error methods to our promise
			// to mimic the $http service. Easier for testing purposes.

			promise.success = function(fn) {
				promise.then(function(data) {
					fn(data, 200, null, null);
				});
				return promise;
			};

			promise.error = function(fn) {
				promise.then(null, function(data) {
					fn(data, 500, null, null);
				});
				return promise;
			};

			return promise;
		}

		var getItems = function () {
			var deferred = $q.defer();
			deferred.resolve([
				{ _id: 1, entry: "One", archived: false, finished: false }
				, { _id: 2, entry: "Two", archived: false, finished: false }
				, { _id: 3, entry: "Three", archived: false, finished: false }
				, { _id: 4, entry: "Four", archived: false, finished: false }
			]);

			return addHttpMethods(deferred.promise);
		};



		return {
			getItems: getItems
		};
	});