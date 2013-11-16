define(['underscore', 'backbone', 'models/master/resource', 'sync/dao/master/ResourceDAO'], function(_, Backbone, Resource, ResourceDAO){
	var ResourceCollection = Backbone.Collection.extend({
		model: Resource,
		dao: ResourceDAO,
		findProtection: function(callbacks) {
			var self = this;
			new this.dao(window.db).findProtection({
				success: function (resource, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(resource);
					callbacks.success();
				},
				error: callbacks.error
			});
		}
	});
	return ResourceCollection;
});