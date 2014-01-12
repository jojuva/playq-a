define(['underscore', 'parse'], 
  function(_, Parse){
	var Log = Parse.Object.extend({
		className: 'Log',
		idAttribute: 'objectId',

		defaults: {
			objectId: null,
			operation: null,
			description: null,
			level: null,
			createdAt: null,
			updatedAt: null
		},

		initialize: function() {
		},

		validation: {
		}

	});
	return Log;
});