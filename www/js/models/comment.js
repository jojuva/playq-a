define(['underscore', 'backbone', 'sync/dao/CommentDAO'], function(_, Backbone, CommentDAO){
	var Comment = Backbone.Model.extend({

		dao: CommentDAO,
		idAttribute: 'commentid',

		defaults: {
			commentid : null,
			datetimeobservation : null,
			textobservation : null,
			taskid : null
		}
	});
	return Comment;
});