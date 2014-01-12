define(['underscore', 'parse', 'models/category', 'sync/dao/categoryDAO'], 
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