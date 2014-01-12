define(['underscore', 'parse', 'sync/dao/categoryDAO'], 
  function(_, Parse, CategoryDAO){
	var Category = Parse.Object.extend({
		className: 'Category',
		dao: CategoryDAO,
		idAttribute: 'objectId',

		defaults: {
			objectId: null,
			name: null,
			createdAt: null,
			updatedAt: null
		},

		initialize: function() {
		},

		validation: {
			objectId: { required: true, msg: 'error.obligatorios' },
			name: { required: true, msg: 'error.obligatorios' }
		}

	});
	return Category;
});