define(['underscore', 'parse', 'models/Category', 'sync/dao/CategoryDAO'], 
  function(_, Parse, Category, CategoryDAO){
	var CategoryCollection = Parse.Collection.extend({
		model: Category,
		dao: CategoryDAO,
		
		comparator: function(model) {
			return model.get('name');
		}
		
	});
	return CategoryCollection;
});