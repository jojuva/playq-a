define(['underscore', 'parse', 'models/ranking', 'sync/dao/rankingDAO'], 
  function(_, Parse, Ranking, RankingDAO){
	var RankingCollection = Parse.Collection.extend({
		model: Ranking,
		dao: RankingDAO,
		
		comparator: function(model) {
			return model.get('user');
		}
		
	});
	return RankingCollection;
});