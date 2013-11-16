define(['jquery', 'underscore.extend', 'backbone.extend', 'views/contesta/pestanyes/meter/installMeter', 'views/contesta/pestanyes/meter/unistallMeter', 'collections/meterCollections', 'text!templates/contesta/meter/meterContent.html', 'jqm'],
function($, _, Backbone, InstallMeter, UnistallMeter, MeterCollection, meterContentTpl) {

	var MeterContent = Backbone.View.extend({
		subviews: {},
		meterInstallCollection: null,
		meterUninstallCollection: null,


		initialize: function(){
			this.template = _.template(meterContentTpl);
			var meters = this.options.meters;

			if (_.isUndefined(meters) || _.isNull(meters)) {
				return;
			}

			this.meterInstallCollection = new MeterCollection();
			this.meterUninstallCollection = new MeterCollection();
			if(this.options.isMeterIns) {
				this.meterInstallCollection.reset(meters.where({operation : METEROPERATION.INSTALAR}));
			}
			if (this.options.isMeterUnins) {
				this.meterUninstallCollection.reset(meters.where({operation : METEROPERATION.RETIRAR}));
			}
		},

		render:function(eventName){
			var editedMeter = (this.options.editedMeterIns === "true" || this.options.editedMeterUnins === "true");
			$(this.el).html(this.template( {edited: editedMeter.toString()} )).i18n();

			if(this.options.isMeterIns) {
				this.renderInstall();
			}
			if(this.options.isMeterUnins){
				this.renderUninstall();
			}
			return this;
		},

		renderInstall: function () {
			var meterInstall = this.meterInstallCollection.findWhere({ dial: 1 }),
				meterSegEsferaInstall = this.meterInstallCollection.findWhere({ dial: 2 });

			if (!_.isUndefined(meterInstall)) {
				this.renderMeterView(meterInstall);
			}
			if (!_.isUndefined(meterSegEsferaInstall)) {
				meterInstall.bind('change:installationdate change:hasretentionvalve change:rownumber change:columnnumber change:manufacturedyear change:emplacementcode change:brandid change:modelid', function(model) {
					meterSegEsferaInstall.set(model.changedAttributes());
				}, this);
				this.renderMeterView(meterSegEsferaInstall);
			}
		},

		renderUninstall: function () {
			var meterUninstall = this.meterUninstallCollection.findWhere({ dial: 1 }),
				meterSegEsferaUninstall = this.meterUninstallCollection.findWhere({ dial: 2 });

			if (!_.isUndefined(meterUninstall)) {
				this.renderMeterView(meterUninstall);
			}
			if (!_.isUndefined(meterSegEsferaUninstall)) {
				meterUninstall.on('change:emplacementcode change:rownumber change:columnnumber change:ismeterinplace', function(model) {
					meterSegEsferaUninstall.set(model.changedAttributes());
				}, this);
				this.renderMeterView(meterSegEsferaUninstall);
			}
		},

		renderMeterView: function (meter) {
			var data = {
				meter: meter,
				brands: this.options.brands,
				models: this.options.models,
				emplacements: this.options.emplacements,
				gauges: this.options.gauges
			};

			if (meter.get('operation') === METEROPERATION.INSTALAR) {
				data.edited = this.options.editedMeterIns;
				this.subviews["meterInstallForm" + meter.id] = new InstallMeter(data).render();
				$('#meterInstall-form', this.el).append(this.subviews["meterInstallForm" + meter.id].el);
			}
			else if (meter.get('operation') === METEROPERATION.RETIRAR) {
				data.edited = this.options.editedMeterUnins;
				this.subviews["meterUninstallForm" + meter.id] = new UnistallMeter(data).render();
				$('#meterUninstall-form', this.el).append(this.subviews["meterUninstallForm" + meter.id].el);
			}
		}
	});

	return MeterContent;
});