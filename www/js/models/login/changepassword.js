define(['underscore', 'backbone'], function(_, Backbone){
	var ChangePassword = Backbone.Model.extend({

		defaults: {
			username: null,
			oldpassword: null,
			newpassword: null,
			repeatnewpassword: null
		},

		validation: {
			username: { required: true, msg: '' },
			oldpassword: { required: true, msg: '' },
			newpassword: [{ required: true, msg: '' }, { equalTo: 'repeatnewpassword', msg: '' }],
			repeatnewpassword: [{ required: true, msg: '' }, { equalTo: 'newpassword', msg: '' }]
		}

	});
	return ChangePassword;
});