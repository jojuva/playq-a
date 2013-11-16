define(['underscore', 'backbone'], function(_, Backbone){
	var QueueGlobal = Backbone.Model.extend({

		idAttribute: 'id',

		defaults: {
			id : null,
			op : null,
			entity: null,
			data: null
		}
	});
	return QueueGlobal;
});