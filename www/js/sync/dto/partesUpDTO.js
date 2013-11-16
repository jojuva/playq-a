define(['underscore', 'backbone'],
	function(_, Backbone) {

		var PartesUpDTO = Backbone.Model.extend({

			url: URL_GET_PARTES,
			//url:baseUrl + 'ParteOk' + sufixUrl,
			local:false,

			defaults: {
				tm: null,
				technicalOperatorId: null,
				date: null,
				workDateTypeForOUId: null,
				vehicleRegistration: null
			},

			initialize: function() {
				this.attributes.tm = window.localStorage.getItem(LS_UUID);
				this.attributes.technicalOperatorId = parseInt(window.localStorage.getItem(LS_OPERATOR_ID), 10);
			}

		});

		return PartesUpDTO;
});