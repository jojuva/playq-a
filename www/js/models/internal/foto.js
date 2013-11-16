define(['underscore', 'backbone'], function(_, Backbone){
	var Foto = Backbone.Model.extend({

		idAttribute: 'number',

		defaults: {
			number : null,
			name : null,
			path: null,
			data: null
		}
	});
	return Foto;
});