define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'mobiscroll',
	'collections/master/ModelCollections', 'text!templates/contesta/meter/meterInstall.html',
	'text!templates/contesta/meter/meterInstallSegundaEsfera.html', 'jqm'],
function($, _, Backbone, stickit, mobiscroll, ModelCollection, meterInstallFormTpl, meterInstallSegEsferaTpl) {

	var MeterInstallForm = Backbone.View.extend({
		brandInit:null,
		bindings:{
			"[id$=-serialnumber]" : "serialnumber",
			"[id$=-brandid]" : {
				observe: "brandid",
				selectOptions: {
					collection: 'this.options.brands',
					labelPath: 'branddescription',
					valuePath: 'brandid',
					defaultOption: {
						label: $.t("select.defaultLabel"),
						value: null
					}
				},
				onSet: function(val) {
					if (!_.isUndefined(models = this.options.models.where({brandid : val}))) {
						this.modelsFromBrand.reset(models);
						this.options.meter.set({modelid: null});
						this.stickit(this.options.meter, this.bindings);
					}
					return val;
				}
			},
			"[id$=-modelid]" : {
				observe: "modelid",
				selectOptions: {
					collection: 'this.modelsFromBrand',
					valuePath: 'modelid',
					labelPath: 'modeldescription',
					defaultOption: {
						label: $.t("select.defaultLabel"),
						value: null
					}
				},
				afterUpdate: function($el, val, options){
					try {
						$('#modelid', this.el).selectmenu("refresh", true);
					} catch (e) {
						// refresh not necessary
					}
				}
			},
			"[id$=-gaugeid]" : {
				observe: "gaugeid",
				selectOptions: {
					collection: 'this.options.gauges',
					labelPath: 'gaugevalue',
					valuePath: 'gaugeid',
					defaultOption: {
						label: $.t("select.defaultLabel"),
						value: null
					}
				}
			},
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
			"[id$=-installationdate]" : {
				observe: "installationdate",
				onSet: 'setDate',
				onGet: 'getDate'
			},
			"[id$=-manufacturedyear]" : "manufacturedyear",
			"[id$=-hasretentionvalve]" : {
				observe: "hasretentionvalve"
			},
			"[id$=-isremotereading-content]": {
				observe: 'isremotereading',
				update: function ($el, val, model, options) {
					val = JSON.parse(val);
					if (val === true) {
						$el.show();
					} else {
						$el.hide();
					}
				}
			},
			"[id$=-isinstallremotereading]": "isinstallremotereading",
			"[id$=-radiomodule]": "radiomodule"
		},

		bindingsSegEsfera: {
			"[id$=-serialnumber]" : "serialnumber",
			"[id$=-gaugeid]" : {
				observe: "gaugeid",
				selectOptions: {
					collection: 'this.options.gauges',
					labelPath: 'gaugevalue',
					valuePath: 'gaugeid',
					defaultOption: {
						label: $.t("select.defaultLabel"),
						value: null
					}
				}
			},
			"[id$=-reading]" : {
				observe: "reading",
				onSet: "setReading"
			}
		},
		setDate: function(value){
			if(!_.isNull(value) && !_.isUndefined(value))
				return moment(value, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm:ss");
			else
				return null;
		},
		getDate: function(value){
			if(!_.isNull(value) && !_.isUndefined(value))
				return moment(value, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY HH:mm");
			else
				return null;
		},
		setReading: function(value) {
			return parseInt(value, 10);
		},

		initialize:function () {
			var dial = this.options.meter.get('dial');
			if (dial === 1) {
				this.template = _.template(meterInstallFormTpl);
			} else if (dial === 2) {
				this.template = _.template(meterInstallSegEsferaTpl);
			}
			
			this.modelsFromBrand = new ModelCollection();
			if (!_.isUndefined(this.options.meter) && !_.isNull(this.options.meter)) {
				this.brandInit = this.options.meter.get('brandid');
				if (!_.isUndefined(models = this.options.models.where({brandid : this.brandInit}))) {
					this.modelsFromBrand.add(models);
				}
			}
		},

		render:function (eventName) {
			var now = new Date(),
				dial = this.options.meter.get('dial');

			$(this.el).html(this.template(this.getTplData())).i18n();

			if (dial === 1) {
				this.stickit(this.options.meter, this.bindings);
				renderMobiscrollDateTime({
					inputs: [$('[id$=-installationdate]', this.el)],
					minDate: new Date(now.getFullYear()-1, now.getMonth(), now.getDate()),
					maxDate: new Date(now.getFullYear()+2, now.getMonth(), now.getDate())
				});

				renderMobiscrollDate({
					inputs: [$('[id$=-manufacturedyear]', this.el)],
					dateFormat: 'yy',
					dateOrder: 'yy'
				});
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
			var $elCheckboxValve = $("[id$=-hasretentionvalve]", this.el);
			$elCheckboxValve.checkboxradio();
			if(this.options.meter.get('hasretentionvalve') === "true"){
				$elCheckboxValve.prop('checked', true).checkboxradio("refresh");
			}else{
				$elCheckboxValve.prop('checked', false).checkboxradio("refresh");
			}

			var $elCheckboxInsRemote = $("[id$=-isinstallremotereading]", this.el);
			$elCheckboxInsRemote.checkboxradio();
			if(this.options.meter.get('isinstallremotereading') === "true"){
				$elCheckboxInsRemote.prop('checked', true).checkboxradio("refresh");
			}else{
				$elCheckboxInsRemote.prop('checked', false).checkboxradio("refresh");
			}
		},

		events: {
			"focusout [id$=-installationdate]" : "scrollAjust",
			"focusout [id$=-manufacturedyear]" : "scrollAjust"
		},

		scrollAjust: function() {
			if (isIOS()) {
				$.mobile.silentScroll(window.pageYOffset);
			}
		}

	});

	return MeterInstallForm;
});