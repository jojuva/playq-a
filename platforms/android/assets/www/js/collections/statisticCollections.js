define(['underscore', 'parse', 'models/statistic', 'sync/dao/statisticDAO'], 
  function(_, Parse, Statistic, CategoryDAO){
	var StatisticCollection = Parse.Collection.extend({
		model: Statistic,
		dao: StatisticDAO,
		
		comparator: function(model) {
			return model.get('user');
		}
		
	});
	return StatisticCollection;
});