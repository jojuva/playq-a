define(['underscore', 'backbone', 'parse', 'i18n'],
	function(_, Backbone, Parse, i18n) {

		var PlayUser = Backbone.Model.extend({

			defaults: {
				username: null,
				email: null,
				password: null,
				repeatpassword: null,
				mobileTerminal: null,
				pushId: null,
				platform: null,
				versionplatform: null,
				versionapp: null,
				language: null
			},

			initialize: function() {
				//his.attributes.mobileTerminal = new UUIDUtils().getUUID();
				//this.attributes.platform = device.platform;
				//this.attributes.versionplatform = device.version;
				this.attributes.versionapp = app_version;
				this.attributes.language = window.localStorage.getItem(LS_LANG);
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
