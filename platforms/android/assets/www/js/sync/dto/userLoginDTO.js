define(['underscore', 'backbone', 'uuidUtils', 'i18n'],
	function(_, Backbone, UUIDUtils, i18n) {

		var UserLoginDTO = Backbone.Model.extend({

			url: URL_DO_LOGIN,

			defaults: {
				sUsername: null,
				sPassword: null,
				mobileTerminal: null,
				pushId: null,
				platform: null,
				versionplatform: null,
				versionapp: null,
				language: null
			},

			initialize: function() {
				this.attributes.mobileTerminal = new UUIDUtils().getUUID();
				this.attributes.platform = device.platform;
				this.attributes.versionplatform = device.version;
				this.attributes.versionapp = app_version;
				this.attributes.language = window.localStorage.getItem(LS_LANG);
			},

			validation: {
				sUsername: { required: true, msg: 'error.obligatorios' },
				sPassword: { required: true, msg: 'error.obligatorios' }
			}

		});

		return UserLoginDTO;
});