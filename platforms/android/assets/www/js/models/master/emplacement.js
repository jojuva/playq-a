define(['underscore', 'backbone', 'sync/dao/master/EmplacementDAO'], function(_, Backbone, EmplacementDAO){
	var Emplacement = Backbone.Model.extend({

		dao: EmplacementDAO,
		idAttribute: 'emplacementcode',

		defaults: {
			emplacementcode : null,
			emplacementdescription : null,
			isdelete : null
		}
	});
	return Emplacement;
});