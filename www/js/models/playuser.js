define(['underscore', 'backbone', 'parse', 'i18n'],
	function(_, Backbone, Parse, i18n) {

		var PlayUser = Backbone.Model.extend({

			url: URL_DO_LOGIN,

			defaults: {
				username: null,
				password: null,
				mobileTerminal: null,
				pushId: null,
				platform: null,
				versionplatform: null,
				versionapp: null,
				language: null
			},

			initialize: function() {
				//his.attributes.mobileTerminal = new UUIDUtils().getUUID();
				this.attributes.platform = device.platform;
				this.attributes.versionplatform = device.version;
				this.attributes.versionapp = app_version;
				this.attributes.language = window.localStorage.getItem(LS_LANG);
			},

			validation: {
				username: { required: true, msg: 'error.obligatorios' },
				password: { required: true, msg: 'error.obligatorios' }
			}

		});

		return PlayUser;
});