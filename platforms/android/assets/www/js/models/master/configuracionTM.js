define(['underscore', 'backbone', 'sync/dao/master/ConfiguracionTMDAO'], function(_, Backbone, ConfiguracionDAO ){
	var Configuracion = Backbone.Model.extend({

		dao: ConfiguracionDAO,
		idAttribute: 'ConfiguracionID',

		defaults: {
			ConfiguracionID : null,
			UID : null,
			aliasTM : null,
			//idTM : null,
			wsSync : null,
			imagesPath : null,
			timeIntervalSync : null,
			logActive : null
		},

		validation: {
			wsSync: { required: true }
		},

		setPushId: function (pushId, callbacks) {
			new this.dao(window.db).setPushId(pushId, callbacks);
		},

		getPushId: function (callbacks) {
			new this.dao(window.db).getPushId(callbacks);
		}
	});
	return Configuracion;
});