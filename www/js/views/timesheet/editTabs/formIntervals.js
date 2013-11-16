define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'moment',  'utils', 'models/timesheet/TSProductive', 'models/timesheet/TSNoProductive', 'text!templates/timesheet/editTabs/productive/editPopup/editFormPopup.html', 'jqm'],
	function($, _, Backbone, stickit, moment, utils, TSProductive, TSNoProductive, editFormTpl) {


	var EditIntervalForm = Backbone.View.extend({
		productiveEdit: null,
		productiveNew: null,
		modelTask: null,
		taskCollection: null,
		tsNoProductive:  null,
		presenceAux: null,
		presenceEdit: null,
		typeInt: null,
		timesheet: null,
		bindings:{
			"[id*='typeHourProdCol']": {
				observe: 'hourTypeForOpUnitId',
				selectOptions: {
					collection: 'this.options.timeSheetHourTypeCol',
					labelPath: 'description',
					valuePath: 'id',
					defaultOption: {
						label: $.t("select.defaultLabel"),
						value: null
					}
				},
				onSet: function(val) {
					return val;
				}
			},
			"[id*='int_init']":{
				observe: 'startDate',
				onGet: 'dateFormat',
				onSet: 'setDateFormat'
			},
			"[id*='int_end']":{
				observe: 'endDate',
				onGet: 'dateFormat',
				onSet: 'setDateFormat'
			}
		},
		dateFormat: function(value){
			if (!_.isNull(value) && !_.isUndefined(value)){
				if(!_.isString(value)){
					value = value.toString();
				}
				return moment(value, "YYYYMMDDHHmmss").format('HH:mm');
			}else{
				return '';
			}
		},
		setDateFormat: function(value){
			if (!_.isNull(value) && !_.isUndefined(value)){
				value = this.timesheet.get('date')+value;
				return moment(value, 'YYYYMMDDHH:mm').format('YYYYMMDDHHmmss');
			}
		},

		initialize: function () {
			this.template = _.template(editFormTpl);
			this.modelTask = this.options.modelTask;
			this.taskCollection = this.options.tstaskCol;
			this.tsNoProductive = this.options.tsNoProdCol;
			this.presenceAux = this.options.presenceAux;
			this.timesheet = this.options.timesheet;
			this.typeInt = this.options.typeInt;
			if(this.typeInt === INTERVAL.PRODUCTIVE){
				this.productiveNew = new TSProductive();
			}else{
				this.productiveNew = new TSNoProductive();
			}
			this.productiveNew.on("validated:invalid", function (model, errors) {
				this.showErrors(errors);
			}, this);
			
		},

		render:function (eventName) {
			$(this.el).html(this.template({typeInt: this.typeInt})).i18n();
			this.renderMobiscroll();
			return this;
		},

		renderMobiscroll: function() {
			renderMobiscrollTime({inputs: [ $("[id*='int_init']", this.el), $("[id*='int_end']", this.el) ]});
		},

		renderEdit: function(model){
			this.hideErrors();
			this.hideErrorMessage($('#errors-forminterval', this.el));
			this.unstickit();
			this.renderMobiscroll();

			this.productiveEdit = model;
			this.productiveNew.set(model.toJSON());
			this.stickit(this.productiveNew, this.bindings);

			$("select", this.el).selectmenu("refresh", true);
			this._setEditButtons();
		},

		resetForm: function() {
			this.hideErrors();
			this.hideErrorMessage($('#errors-forminterval', this.el));
			this.unstickit();
			this.renderMobiscroll();

			var dataSet = {date: this.timesheet.get('date')};
			if(this.typeInt === INTERVAL.PRODUCTIVE){
				if(!_.isUndefined(this.modelTask) && !_.isNull(this.modelTask)){
					dataSet.taskId = this.modelTask.get('taskId');
				}
			}
			this.productiveNew.set(this.productiveNew.defaults);
			this.productiveNew.set(dataSet);
			this.stickit(this.productiveNew, this.bindings);

			this._setAddButtons();
			this.resetSelect();
		},

		resetSelect: function(){
			$("select", this.el).each(function(i, element) {
				$(element).val('-1').attr('selected', true).siblings('option').removeAttr('selected');
				try {
					$(element).selectmenu("refresh", true);
				}
				catch (e) {}
			});
		},

		_setAddButtons: function(){
			$("[id*='editar_interval']", this.el).hide();
			$("[id*='cancel_editar_interval']", this.el).hide();
			$("[id*='crear_interval']", this.el).show();
		},

		_setEditButtons: function(){
			$("[id*='crear_interval']", this.el).hide();
			$("[id*='editar_interval']", this.el).show();
			$("[id*='cancel_editar_interval']", this.el).show();
		},

		events: {
			"click a[id^='crear_interval']" : "addInterval",
			"click a[id^='editar_interval']" : "editInterval",
			"click a[id^='cancel_editar_interval']" : "cancelEdit"
		},

		addInterval: function(event) {
			event.preventDefault();
			event.stopPropagation();
			var nonEditPresences = this.presenceAux.models.concat(this.tsNoProductive.models);
			this.checkValidInterval(nonEditPresences, 'add');
		},

		editInterval: function(event) {
			event.preventDefault();
			event.stopPropagation();
			var nonEditPresences = this.presenceAux.without(this.productiveEdit).concat(this.tsNoProductive.models);
			this.checkValidInterval(nonEditPresences, 'edit');
		},

		checkValidInterval: function(nonEditPresences, mode) {
			this.hideErrors();
			if(this.productiveNew.isValid(true)) {
				//mirem que no se solapi
				result = comprobarIntervaloPresencias(this.taskCollection, nonEditPresences, this.productiveNew.get('startDate'), this.productiveNew.get('endDate'));
				if(result === null) {
					if (mode === 'add') {
						this.presenceAux.add(this.productiveNew.clone());
					}
					else if (mode === 'edit') {
						this.productiveEdit.set(this.productiveNew.toJSON());
					}
					this.resetForm();
				} else {
					var errorMsg = {error: { text: result, i18n: false }};
					this.showErrorMessage($('#errors-forminterval', this.el), errorMsg);
				}
			} else {
				this.productiveNew.validate();
			}
		},

		cancelEdit: function(event){
			event.preventDefault();
			event.stopPropagation();
			this.resetForm();
			this.renderMobiscroll();
		}
	});
	return EditIntervalForm;
});