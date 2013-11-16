define(['underscore', 'backbone', 'sync/dao/master/ResourceDAO'], function(_, Backbone, ResourceDAO){
	var Resource = Backbone.Model.extend({
		dao: ResourceDAO,
		idAttribute: 'resourceid',

		defaults: {
			resourceid: null,
			resourcedescription: null,
			protectiontype: null,
			resourcetypedescription: null,
			resourcetypeid: null
		}

	});
	return Resource;
});