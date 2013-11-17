define(['underscore', 'backbone', 'sync/dao/master/ModelDAO'], function(_, Backbone, ModelDAO){
	var Model = Backbone.Model.extend({

		dao: ModelDAO,
		idAttribute: 'id',

		defaults: {
			id: null,
			modelid : null,
			brandid : null,
			modeldescription : null,
			digitsnumber : null,
			isdelete : null
		}
	});
	return Model;
});