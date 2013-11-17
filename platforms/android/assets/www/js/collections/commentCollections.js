define(['underscore', 'backbone', 'models/comment', 'sync/dao/CommentDAO'], function(_, Backbone, Comment, CommentDAO){
	var CommentCollection = Backbone.Collection.extend({
		model: Comment,
		dao: CommentDAO,

		findByTask: function(taskid, callbacks) {
			var self = this;
			new this.dao(window.db).findByTask(taskid, {
				success: function (comment, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(comment);
					callbacks.success();
				},
				error: callbacks.error
			});
		}
	});
	return CommentCollection;
});