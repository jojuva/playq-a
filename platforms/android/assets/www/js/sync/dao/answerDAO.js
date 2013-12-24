define(['underscore', 'parse'], 
  function(_, Parse){
	var AnswerDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.ANSWER;
		this.columns = {
			objectId: { type: TYPE.TEXT, notNull: true, pk: true },
			name : { type: TYPE.TEXT },
			description: { type: TYPE.TEXT },
			correct: { type: TYPE.BOOLEAN },
			createdAt:{ type: TYPE.DATE },
			updatedAt: { type: TYPE.DATE },
			ACL: { type: TYPE.ACL }
		};
	};

	_.extend(AnswerDAO.prototype, {

		findAll:function (callbacks) {
			var answers = Parse.Collection.extend("AnswerCollection");
			var query = new Parse.Query(Answer);
			query.find( {
			  success: function(answers) {
				// results is an array of Parse.Object.
			  },
			  error: function(error) {
				// error is an instance of Parse.Error.
			  }
			});		
		},
		find:function (model, callbacks) {
			var Answer = Parse.Object.extend("Answer");
			var query = new Parse.Query(Answer);
			query.get(model.id, {
			  success: function(object) {
				// The object was retrieved successfully.
			  },
			  error: function(object, error) {
				// The object was not retrieved successfully.
				// error is a Parse.Error with an error code and description.
			  }
			});		
		},
		findByQuestion:function (question, callbacks) {
			console.log('answerDAO.findByQuestion');
			var query = new Parse.Query("Answer");
			query.equalTo("question",question);
			query.find({
			  success: function(objects) {
				// The object was retrieved successfully.
				console.log("#answers:"+objects.length);
				callbacks.success(objects);
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
		saveData: function (tx, answer) {
			answer.save(null, {
			  success: function(answer) {
				// Execute any logic that should take place after the object is saved.
				alert('New object created with objectId: ' + answer.id);
			  },
			  error: function(answer, error) {
				// Execute any logic that should take place if the save fails.
				// error is a Parse.Error with an error code and description.
				alert('Failed to create new object, with error code: ' + error.description);
			  }
			});
		},
		deleteRow: function(tx, answer){
			answer.destroy({
			  success: function(answer) {
				// The object was deleted from the Parse Cloud.
			  },
			  error: function(answer, error) {
				// The delete failed.
				// error is a Parse.Error with an error code and description.
			  }
			});		
		},
		deleteAllRows: function (tx) {
		}
	});
	return AnswerDAO;
});