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
		}
		
	});
	return Ranking;
});