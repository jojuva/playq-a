define(['underscore', 'backbone', 'models/taskList', 'sync/dao/TaskListDAO'], function(_, Backbone, TaskList, TaskListDAO){
	var TaskListCollection = Backbone.Collection.extend({
		model: TaskList,
		dao: TaskListDAO,
		initialize: function(){
			this.sortVar = 'sort';
		},
		comparator: function( collection ){
			var that = this;
			return( collection.get( that.sortVar ) );
		},
		getData: function(callbacks) {
			var self = this;
			//this.reset();
			new this.dao(window.db).getData({
				success: function (tasklist, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.reset(tasklist);
					//self.trigger("addAll");
					callbacks.success();
				},
				error: callbacks.error
			});
		},

		fetch: function(options){
			var self = this,
				successCallback = (!_.isUndefined(options)) ? options.success : undefined;
			options = options ? _.clone(options) : {};
			options.success = function(options) {
				self.getData({
					success: function () {
						if (successCallback) successCallback();
					},
					error: (!_.isUndefined(options)) ? options.error : undefined
				});
			};
			return Backbone.Collection.prototype.fetch.call(this, options);
		}
	});
	return TaskListCollection;
});