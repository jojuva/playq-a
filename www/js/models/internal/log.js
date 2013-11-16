define(['underscore', 'backbone','moment', 'sync/dao/internal/LogDAO'], function(_, Backbone, moment, LogDAO){
	var Log = Backbone.Model.extend({

		dao: LogDAO,
		idAttribute: 'LogID',

		defaults: {
			LogID : null,
			Date : null,
			Operation: null,
			Description: null,
			Uuid: null,
			SOVersio: null,
			Nivel: null
		},

		initialize: function(attrs) {
			if (_.isUndefined(attrs)) {
				this.attributes.Uuid = (!_.isUndefined(window.device)) ? window.device.uuid : null;
				this.attributes.SOVersio = (!_.isUndefined(window.device)) ? window.device.version : null;
				this.attributes.Date = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
			}
		}
	});
	return Log;
});