define(['underscore', 'parse'], 
  function(_, Parse){
	var StatisticDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.STATISTIC;
		this.columns = {
			objectId: { type: TYPE.TEXT, notNull: true, pk: true },
			user: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.USER, columns: 'objectId'}},
			totScore: { type: TYPE.INT },
			okAnswers: { type: TYPE.INT },
			koAnswers: { type: TYPE.INT },
			maxStrike: { type: TYPE.INT },
			avgTime: { type: TYPE.INT },
			createdAt:{ type: TYPE.DATE },
			updatedAt: { type: TYPE.DATE },
			ACL: { type: TYPE.ACL }
		};
	};

	_.extend(StatisticDAO.prototype, {

		findAll:function (callbacks) {
			var StatisticList = Parse.Collection.extend("StatisticCollection");
			var query = new Parse.Query(StatisticList);
			query.find( {
			  success: function(objects) {
				// results is an array of Parse.Object.
			  },
			  error: function(error) {
				// error is an instance of Parse.Error.
			  }
			});		
		},
		find:function (model, callbacks) {
			var Statistic = Parse.Object.extend("Statistic");
			var query = new Parse.Query(Statistic);
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
		saveData: function (tx, model) {
			model.save(null, {
			  success: function(object) {
				// Execute any logic that should take place after the object is saved.
				alert('New object created with objectId: ' + object.id);
			  },
			  error: function(object, error) {
				// Execute any logic that should take place if the save fails.
				// error is a Parse.Error with an error code and description.
				alert('Failed to create new object, with error code: ' + error.code);
			  }
			});
		},
		deleteRow: function(tx, model){
			model.destroy({
			  success: function(object) {
				// The object was deleted from the Parse Cloud.
			  },
			  error: function(object, error) {
				// The delete failed.
				// error is a Parse.Error with an error code and description.
			  }
			});		
		},
		deleteAllRows: function (tx) {
		}
	});
	return StatisticDAO;
});