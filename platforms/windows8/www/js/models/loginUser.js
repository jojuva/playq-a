define(['underscore', 'backbone', 'parse', 'i18n'],
	function(_, Backbone, Parse, i18n) {

		var LoginUser = Backbone.Model.extend({

			defaults: {
				username: null,
				password: null
			},

			initialize: function() {
			},
			
			validation: {
				username: { required: true, msg: 'error.obligatorios' },
				password: { required: true, msg: 'error.obligatorios' }
			}
			
		});

		return LoginUser;
});