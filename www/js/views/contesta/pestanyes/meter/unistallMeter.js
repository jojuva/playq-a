define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend',
	'text!templates/contesta/meter/meterUninstall.html',
	'text!templates/contesta/meter/meterUninstallSegundaEsfera.html', 'jqm'],
function($, _, Backbone, stickit, meterUninstallFormTpl, meterUninstallSegEsferaTpl) {

	var MeterUninstallForm = Backbone.View.extend({
		brandInit:null,
		brands: null,
		models: null,
		bindings:{
			"[id$=-serialnumber]" : "serialnumber",
			"[id$=-brandid]" : {
				observe: "brandid",
				onGet: "getLabelBrand"
			},
			"[id$=-modelid]" : {
				observe: 'modelid',
				onGet: 'getLabelModel'
			},
			"[id$=-gaugeid]" : "gaugeid",
			"[id$=-emplacementcode]" : {
				observe: "emplacementcode",
				selectOptions: {
					collection: 'this.options.emplacements',
					labelPath: "emplacementdescription",
					valuePath:"emplacementcode",
					defaultOption: {
						label: $.t("select.defaultLabel"),
						value: null
					}
				}
			},
			"[id$=-rownumber]" : "rownumber",
			"[id$=-columnnumber]" : "columnnumber",
			"[id$=-reading]" : {
				observe: "reading",
				onSet: "setReading"
			},
			"[id$=-ismeterinplace]" : {
				observe: "ismeterinplace"
			},
			"[id$=-isremotereading]": {
				observe: 'isremotereading',
				onGet: 'getIsRemoteReading'
			},
			"[id$=-radiomodule]": "radiomodule"
		},

		bindingsSegEsfera: {
			"[id$=-reading]" : {
				observe: "reading",
				onSet: "setReading"
			}
		},

		getLabelBrand:function(value){
			if (!_.isUndefined(this.brands) && !_.isNull(this.brands)) {
				var br = this.brands.findWhere({brandid: value});
				if(!_.isUndefined(br) && !_.isNull(br)){
					return br.get('branddescription');
				}
			}
			return '-';
		},

		getLabelModel:function(value){
			if (!_.isUndefined(this.models) && !_.isNull(this.models)) {
				var mdl = this.models.findWhere({modelid: value});
				if(!_.isUndefined(mdl) && !_.isNull(mdl)){
					return mdl.get('modeldescription');
				}
			}
			return '-';
		},

		setReading: function(value) {
			return parseInt(value, 10);
		},

		getIsRemoteReading: function(value) {
			var val = JSON.parse(value);
			if (val === false) {
				$('[id$=-radiomodule-content]', this.el).hide();
				return $.t('contesta.meter.readingNo');
			} else if (val === true) {
				return $.t('contesta.meter.readingYes');
			}
		},

		initialize:function () {
			var dial = this.options.meter.get('dial');
			if (dial === 1) {
				this.template = _.template(meterUninstallFormTpl);
			} else if (dial === 2) {
				this.template = _.template(meterUninstallSegEsferaTpl);
			}

			if (!_.isUndefined(this.options.meter) && !_.isNull(this.options.meter)) {
				this.brandInit = this.options.meter.get('brandid');
			}
			this.brands = this.options.brands;
			this.models = this.options.models;
		},

		render:function (eventName) {
			var dial = this.options.meter.get('dial');
			$(this.el).html(this.template(this.getTplData())).i18n();

			if (dial === 1) {
				this.stickit(this.options.meter, this.bindings);
				this.prepareView();
			}
			else if (dial === 2) {
				this.stickit(this.options.meter, this.bindingsSegEsfera);
			}

			return this;
		},

		getTplData: function () {
			var meter = this.options.meter;
			return {
				edited: this.options.edited,
				idPrefix: meter.getIdPrefix()
			};
		},

		prepareView: function() {
			var $elCheckbox = $("[id$=-ismeterinplace]", this.el);
			$elCheckbox.checkboxradio();
			if(this.options.meter.get('ismeterinplace') === "true"){
				$elCheckbox.prop('checked', true).checkboxradio("refresh");
			}else{
				$elCheckbox.prop('checked', false).checkboxradio("refresh");
			}
		}
	});

	return MeterUninstallForm;
});