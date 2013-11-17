define(['underscore', 'backbone', 'sync/dao/master/BrandDAO'], function(_, Backbone, BrandDAO){
	var Brand = Backbone.Model.extend({
		dao: BrandDAO,
		idAttribute: 'brandid',

		defaults: {
			brandid : null,
			branddescription : null,
			isdelete : null
		}
	});
	return Brand;
});