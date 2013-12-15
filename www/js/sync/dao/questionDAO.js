define(['underscore', 'parse'], 
  function(_, Parse){
	var QuestionDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.QUESTION;
		this.columns = {
			objectId: { type: TYPE.TEXT, notNull: true, pk: true },
			name : { type: TYPE.TEXT },
			description: { type: TYPE.TEXT },
			score: { type: TYPE.INT },
			categories: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.CATEGORY, columns: 'objectId'}},
			answers: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.ANSWER, columns: 'objectId'}},
			createdAt:{ type: TYPE.DATE },
			updatedAt: { type: TYPE.DATE },
			ACL: { type: TYPE.ACL }
		};
	};

	_.extend(QuestionDAO.prototype, {

		findAll:function (callbacks) {
			var Question = Parse.Object.extend("Question");
			var questions = Parse.Collection.extend("QuestionCollection");
			var query = new Parse.Query(Question);
			query.find( {
			  success: function(questions) {
				// results is an array of Parse.Object.
			  },
			  error: function(error) {
				// error is an instance of Parse.Error.
			  }
			});		
		},
		find:function (model, callbacks) {
			var Question = Parse.Object.extend("Question");
			var query = new Parse.Query(Question);
			query.get(model.id, {
			  success: function(Question) {
				// The object was retrieved successfully.
			  },
			  error: function(object, error) {
				// The object was not retrieved successfully.
				// error is a Parse.Error with an error code and description.
			  }
			});		
		},
		findByCategory: function(catId, callbacks){
			var query = new Parse.Query("Question");
			var Category = Parse.Object.extend("Category");
			var cat = new Category();
			cat.set("objectId",catId);			
			query.equalTo("categories",cat);
			//query.include("answers");
			query.find( {
			  success: function(objects) {
				// The object was retrieved successfully.
				console.log("#questions:"+objects.length);
				if (objects.length!=0){
					callbacks.success(objects);
				}else{
					callbacks.error('no questions for this category');
				}
			  },
			  error: function(error) {
				// The object was not retrieved successfully.
				// error is a Parse.Error with an error code and description.
				console.log(error.code);
				console.log(error.message);		
				callbacks.error(error);				
			  }
			});				
			
		},
		saveData: function (tx, question) {
			question.save(null, {
			  success: function(question) {
				// Execute any logic that should take place after the object is saved.
				alert('New object created with objectId: ' + question.id);
			  },
			  error: function(question, error) {
				// Execute any logic that should take place if the save fails.
				// error is a Parse.Error with an error code and description.
				alert('Failed to create new object, with error code: ' + error.description);
			  }
			});
		},
		deleteRow: function(tx, question){
			question.destroy({
			  success: function(question) {
				// The object was deleted from the Parse Cloud.
			  },
			  error: function(question, error) {
				// The delete failed.
				// error is a Parse.Error with an error code and description.
			  }
			});		
		},
		deleteAllRows: function (tx) {
		}
	});
	return QuestionDAO;
});