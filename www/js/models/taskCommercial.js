define(['underscore', 'backbone', 'sync/dao/TaskCommercialDAO'], function(_, Backbone, TaskCommercialDAO){
	var TaskCommercial = Backbone.Model.extend({

		dao: TaskCommercialDAO,
		idAttribute: 'taskcommercialid',

		defaults: {
			taskcommercialid : null,
			reclaimedbill : null,
			customertotaldebt : null,
			amountreplacementsupply : null,
			amountgiventoaccount : null,
			taskid : null
		}
	});
	return TaskCommercial;
});