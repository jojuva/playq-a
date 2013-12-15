define(['underscore', 'parse', 'sync/dao/statisticDAO'], 
  function(_, Parse, StatisticDAO){
	var Statistic = Parse.Object.extend({
		className: 'Statistic',
		dao: StatisticDAO,
		idAttribute: 'objectId',

		defaults: {
			objectId: null,
			user: null,
			totScore: 0,
			okAnswers: 0,
			koAnswers: 0,
			maxStrike: 0,
			avgTime: 0,
			createdAt: null,
			updatedAt: null
		},

		initialize: function() {
		},

		validation: {
			objectId: { required: true, msg: 'error.obligatorios' },
			user: { required: true, msg: 'error.obligatorios' }
		},
		
		getMyStatistic: function (callbacks) {
			var self = this;
		
			var query = new Parse.Query(Statistic);
			query.equalTo('user', Parse.User.current());
			query.include('user');
			query.find({
			  success: function(stat) {
				console.log("Successfully retrieved stat " + stat[0].toSource());
				self.add(stat[0]);
				self.set({
					objectId: stat[0].id,
					createdAt: stat[0].createdAt,
					updatedAt: stat[0].updatedAt
				});
				callbacks.success();
			  },
			  error: function(error) {
				console.log("Error: " + error.code + " " + error.message);
				callbacks.error();
			  }
			});
		}		
		
	});
	return Statistic;
});