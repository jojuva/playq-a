define(['underscore', 'backbone', 'sync/dao/master/OperatorDAO'], function(_, Backbone, OperatorDAO){
	var Operator = Backbone.Model.extend({

		dao: OperatorDAO,
		idAttribute: 'userid',

		defaults: {
			userid : null,
			username : null,
			name : null,
			password : null,
			uoid : null,
			isdelete : null
		}
	});
	return Operator;
});