define(['underscore', 'backbone', 'parse', 'i18n'],
	function(_, Backbone, Parse, i18n) {

		var PlayUser = Backbone.Model.extend({

			defaults: {
				username: null,
				email: null,
				password: null,
				repeatpassword: null
			},

			initialize: function() {
			},

			validation: {
				username: { required: true, msg: 'error.obligatorios' },
				email: { required: false, pattern: 'email', msg: 'error.emailPattern' },
				password: { required: true, msg: 'error.obligatorios' },
				repeatpassword: { required: true, equalTo: 'password', msg: 'error.failRepeatPassword' },
			}
			
		});

		return PlayUser;
});
