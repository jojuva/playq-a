define(['underscore', 'parse'], 
  function(_, Parse){
	var CategoryDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.CATEGORY;
		this.columns = {
			objectId: { type: TYPE.TEXT, notNull: true, pk: true },
			name : { type: TYPE.TEXT },
			createdAt:{ type: TYPE.DATE },
			updatedAt: { type: TYPE.DATE },
			ACL: { type: TYPE.ACL }
		};
	};

	_.extend(CategoryDAO.prototype, {

		findAll:function (callbacks) {
			var categories = Parse.Collection.extend("CategoryCollection");
			var query = new Parse.Query(Category);
			query.find( {
			  success: function(categories) {
				// results is an array of Parse.Object.
			  },
			  error: function(error) {
				// error is an instance of Parse.Error.
			  }
			});		
		},
		find:function (model, callbacks) {
			var category = Parse.Object.extend("Category");
			var query = new Parse.Query(Category);
			query.get(model.id, {
			  success: function(category) {
				// The object was retrieved successfully.
			  },
			  error: function(object, error) {
				// The object was not retrieved successfully.
				// error is a Parse.Error with an error code and description.
			  }
			});		
		},
		saveData: function (tx, category) {
			category.save(null, {
			  success: function(category) {
				// Execute any logic that should take place after the object is saved.
				alert('New object created with objectId: ' + category.id);
			  },
			  error: function(category, error) {
				// Execute any logic that should take place if the save fails.
				// error is a Parse.Error with an error code and description.
				alert('Failed to create new object, with error code: ' + error.code);
			  }
			});
		},
		deleteRow: function(tx, category){
			category.destroy({
			  success: function(category) {
				// The object was deleted from the Parse Cloud.
			  },
			  error: function(category, error) {
				// The delete failed.
				// error is a Parse.Error with an error code and description.
			  }
			});		
		},
		deleteAllRows: function (tx) {
		}
	});
	return CategoryDAO;
});