define(['underscore', 'parse', 'sync/dao/rankingDAO'], 
  function(_, Parse, RankingDAO){
	var Ranking = Parse.Object.extend({
		className: 'Ranking',
		dao: RankingDAO,
		idAttribute: 'objectId',

		defaults: {
			objectId: null,
			position: null,
			user: null,
			score: 0,
			createdAt: null,
			updatedAt: null
		},

		initialize: function() {
		},

		validation: {
			objectId: { required: true, msg: 'error.obligatorios' },
			user: { required: true, msg: 'error.obligatorios' }
		},
		
		getMyRanking: function (callbacks) {
			var self = this;
		
			var query = new Parse.Query(Ranking);
			query.equalTo('user', Parse.User.current());
			query.include('user');
			query.find({
			  success: function(rank) {
				//console.log("Successfully retrieved rank " + stat[0].toSource());
				self.add(rank[0]);
				self.set({
					objectId: rank[0].id,
					createdAt: rank[0].createdAt,
					updatedAt: rank[0].updatedAt
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
	return Ranking;
});