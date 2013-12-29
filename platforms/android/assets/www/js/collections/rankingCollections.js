define(['underscore', 'parse', 'models/ranking', 'sync/dao/rankingDAO'], 
  function(_, Parse, Ranking, RankingDAO){
	var RankingCollection = Parse.Collection.extend({
		model: Ranking,
		dao: RankingDAO,
		
		comparator: function(model) {
			return model.get('user');
		},
		
		getTop10: function (callbacks) {
			var self = this;
		
			var query = new Parse.Query(Ranking);
			query.limit(10);
			query.descending('score');
			query.include('user');
			query.find({
			  success: function(ranks) {
				console.log("Successfully retrieved ranks " + ranks[0].id);
				_.each(ranks, function (rank,index) {
					ranks[index].set('position',index+1);
				});				
				self.add(ranks);
				callbacks.success();
			  },
			  error: function(error) {
				console.log("Error: " + error.code + " " + error.message);
				callbacks.error();
			  }
			});
		}
		
	});
	return RankingCollection;
});