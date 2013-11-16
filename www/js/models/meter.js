define(['underscore', 'backbone', 'sync/dao/MeterDAO'], function(_, Backbone, MeterDAO){
	var Meter = Backbone.Model.extend({

		dao: MeterDAO,
		idAttribute: 'meterid',

		defaults: {
			meterid : null,
			meterseqid : null,
			dial : null,
			operation : null,
			serialnumber : null,
			reading : null,
			installationdate : null,
			hasretentionvalve : null,
			rownumber : null,
			columnnumber : null,
			ismeterinplace : null,
			manufacturedyear: null,
			emplacementcode : null,
			gaugeid : null,
			brandid : null,
			modelid: null,
			isremotereading: null,
			isinstallremotereading: null,
			radiomodule: null,
			taskid : null
		},

		getIdPrefix: function (){
			return this.get('operation') + '-' + this.get('dial') + '-';
		},

		validation: {
			serialnumber: function(value, attr, computedState) {
				if (computedState.operation === METEROPERATION.INSTALAR && _.isEmpty(value)) {
					if (computedState.dial === 1) {
						return 'error.validation.serialnumber.required';
					}
					else {
						return 'error.validation.serialnumber.required2';
					}
				}
			},
			brandid: function(value, attr, computedState) {
				if (computedState.operation === METEROPERATION.INSTALAR && _.isEmpty(value) && computedState.dial === 1) {
					return 'error.validation.brandid.required';
				}
			},
			modelid: function(value, attr, computedState) {
				if (computedState.operation === METEROPERATION.INSTALAR && _.isEmpty(value) && computedState.dial === 1) {
					return 'error.validation.modelid.required';
				}
			},
			gaugeid: function(value, attr, computedState) {
				if (computedState.operation === METEROPERATION.INSTALAR && _.isEmpty(value)) {
					if (computedState.dial === 1) {
						return 'error.validation.gaugeid.required';
					}
					else {
						return 'error.validation.gaugeid.required2';
					}
				}
			},
			emplacementcode: function(value, attr, computedState) {
				if (computedState.operation === METEROPERATION.INSTALAR && _.isEmpty(value) && computedState.dial === 1) {
					return 'error.validation.emplacementcode.required';
				}
			},
			rownumber: function(value, attr, computedState) {
				value = parseInt(value, 10);
				if (computedState.operation === METEROPERATION.INSTALAR && _.isNaN(value) && computedState.dial === 1) {
					return 'error.validation.rownumber.required';
				}
			},
			columnnumber: function(value, attr, computedState) {
				value = parseInt(value, 10);
				if (computedState.operation === METEROPERATION.INSTALAR && _.isNaN(value) && computedState.dial === 1) {
					return 'error.validation.columnnumber.required';
				}
			},
			installationdate: function(value, attr, computedState) {
				if (computedState.operation === METEROPERATION.INSTALAR && _.isEmpty(value) && computedState.dial === 1) {
					return 'error.validation.installationdate.required';
				}
			},
			reading: function(value, attr, computedState) {
				var val = parseInt(value, 10);
				if (computedState.operation === METEROPERATION.RETIRAR) {
					if (JSON.parse(computedState.ismeterinplace) === true && _.isNaN(val)) {
						if (computedState.dial === 1) {
							return 'error.validation.reading.required';
						}
						else {
							return 'error.validation.reading.required2';
						}
					}
				} else if (computedState.operation === METEROPERATION.INSTALAR && _.isNaN(val)) {
					if (computedState.dial === 1) {
						return 'error.validation.reading.requiredIns';
					}
					else {
						return 'error.validation.reading.requiredIns2';
					}
				}
			},
			radiomodule: function(value, attr, computedState) {
				if (computedState.operation === METEROPERATION.INSTALAR) {
					var remoteReading = JSON.parse(computedState.isremotereading),
						installRemote = JSON.parse(computedState.isinstallremotereading);
					if (remoteReading === true && installRemote === true && _.isEmpty(value)) {
						return 'error.validation.radiomodule.required';
					}

				}
			}
		}
	});
	return Meter;
});