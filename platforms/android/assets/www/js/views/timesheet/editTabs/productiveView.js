define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'moment', 'utils', 'models/timesheet/TSProductive', 'models/timesheet/TSTask',  'text!templates/timesheet/editTabs/productive/productiveContent.html', 'text!templates/timesheet/editTabs/productive/productiveForm.html', 'text!templates/timesheet/editTabs/productive/productiveItemList.html', 'jqm'],
	function($, _, Backbone, stickit, moment, utils, TSProductive, TSTask, productiveContentTpl, productiveFormTpl, productiveItemListTpl) {

	var ProductiveHourItemList = Backbone.View.extend({
		parent: null,
		tstask: null,
		tagName: 'li',
		bindings:{
			'#task-date-duration':{
				observe: 'date',
				onGet: 'getIntervalGlobal'

			},
			"#task-accountCode" : "accountCode",
			"#task-desc" : "taskDescription",
			"#task-address" : "realAddress"
		},
		getIntervalGlobal: function(value){
			if(!_.isNull(this.tstask.get('tsproductivetime'))){
				var intervalo = this.tstask.getIntervaloGlobal();
				var duracion = this.tstask.getDuracionTotal();

				return moment((intervalo.get('startDate')).toString(), 'YYYYMMDDHHmmss').format('HH:mm')+'-'+moment((intervalo.get('endDate')).toString(), 'YYYYMMDDHHmmss').format('HH:mm')+'  '+moment.utc(duracion).format("HH:mm");
			}else{
				return '-';
			}
		},
		dateFormat: function(value){
			if (!_.isNull(value) && !_.isEmpty(value)){
				if(!_.isString(value)){
					value = value.toString();
				}
				return moment(value, "YYYYMMDDHHmmss").format('HH:mm');
			}else{
				return '';
			}
		},
		
		initialize: function() {
			this.template = _.template(productiveItemListTpl);
			this.tstask = this.model;
			this.parent = this.options.parent;
		},

		render: function (eventName) {
			$(this.el).html(this.template({tsproductiveid: this.model.get('tstaskid')})).i18n();
			this.stickit();
			$(this.el).trigger('create');
			return this;
		},

		events : {
			"click a[id^=delete-productive-]" : "removeProductiveHour",
			"click a[id^=edit-productive-]" : "editProductiveHour"
		},

		removeProductiveHour: function (event) {
			this.parent.removeProductiveHour(this.model);
		},

		editProductiveHour: function (event) {
			/*popup*/
			this.parent.editProductiveHour(this.model);
		}
	});

	var ProductiveHourListView = Backbone.View.extend({
		tsTaskCollection: null,
		productiveCollection: null,
		parent: null,

		initialize:function () {
			if(!_.isUndefined(this.options.model) && !_.isNull(this.options.model.get('tsTask'))){
				this.tsTaskCollection = this.options.model.get('tsTask');
				this.tsTaskCollection.bind("reset add remove listProdRepaint", this.renderProductive, this);
			}
			this.productiveCollection = this.options.productiveCol;
			if(!_.isNull(this.productiveCollection)){
				this.productiveCollection.bind("reset add remove", this.refreshTotalHores, this);
			}
			this.parent = this.options.parent;
		},

		render:function (eventName) {
			this.renderProductive();
			this.refreshTotalHores();
			return this;
		},

		renderProductive: function () {
			$pList = $('#productive-list', this.el);
			$pList.find('li:gt(0)', this.el).remove();
			if (this.tsTaskCollection.size() === 0) {
				$pList.hide();
				return;
			}

			$pList.show();
			this.tsTaskCollection.each(function(tstask) {
				view = new ProductiveHourItemList({
					model: tstask,
					parent: this
				});
				tstask.bind('remove', view.remove);
				$pList.append(view.render().el);
			}, this);
			try {
				$pList.listview('refresh');
			} catch(e) {
				// no need refresh
			}
		},

		refreshTotalHores: function(){
			var total = this.productiveCollection.getTotal(),
				hores = null;

			if(total !== '') {
				hores = moment.utc(total).format("HH:mm")+'h';
			} else {
				hores = '00:00h';
			}
			$('#productive-total', this.el).html(hores);
		},

		removeProductiveHour: function(model){
			var self = this;
			this.tsTaskCollection.remove(model);
			//Eliminem els intervals d'aquesta tasca de la colecció de productive
			this.productiveCollection.removeByTask(model);

			this.parent.addToCombo(model);
		},

		editProductiveHour: function(model){
			this.parent.showEditIntervalPopup(model);
		}
	});



	var ProductiveForm = Backbone.View.extend({
		timeSheetGlobal: null,
		tsTasks: null,
		tasksCombo: null,
		tsNoProductive: null,
		produtiveCol: null,
		bindings: {
			'#tasksoutoflist': {
				observe: 'tstask',
				selectOptions: {
					collection: 'this.tasksCombo',
					labelPath: 'label',
					valuePath: 'tstaskid',
					defaultOption: {
						label: $.t("select.defaultLabel"),
						value: null
					}
				}
			}
		},

		initialize:function () {
			this.template = _.template(productiveFormTpl);
			this.timeSheetGlobal = this.options.model;
			this.productiveCol = this.options.productiveCol;

			if(!_.isUndefined(this.timeSheetGlobal) && !_.isNull(this.timeSheetGlobal.get('timeSheet'))){
				this.productiveNew = new TSProductive({
					timesheetdate: this.timeSheetGlobal.get('timeSheet').get('timesheetdate'),
					userid: this.timeSheetGlobal.get('timeSheet').get('userid')
				});
			}
			if(!_.isUndefined(this.timeSheetGlobal) && !_.isUndefined(this.timeSheetGlobal.get('tsTask'))  && !_.isUndefined(this.timeSheetGlobal.get('tsNoProductive'))){
				this.tasksCombo = this.timeSheetGlobal.getDeletedTasks();
				this.tsTasks = this.timeSheetGlobal.get('tsTask');
				this.tsNoProductive = this.timeSheetGlobal.get('tsNoProductive');
			}
			this.tasksCombo.bind('add remove change', this.render, this);
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();
			this.stickit(this.productiveNew, this.bindings);
			$(this.el).trigger('create');
			return this;
		},

		addToCombo: function (model) {
			model.set({
				label: model.get('taskDescription') + ' - ' + model.get('realAddress')
			});
			this.tasksCombo.add(model);
			try {
				$('#tasksoutoflist', this.el).val('-1').attr('selected', true).siblings('option').removeAttr('selected');
				$('#tasksoutoflist', this.el).selectmenu("refresh", true);
			}
			catch (e) {}
			
		},

		events:{
			"click #add_productive" : "addProductive"
		},

		addProductive: function(event) {
			event.preventDefault();
			event.stopPropagation();
			this.hideErrorMessage($('#errors-productiveForm', this.el));

			if (_.isUndefined(this.tsTasks)) {
				return;
			}

			var tstaskId = $('#tasksoutoflist option:selected', this.el).val();
			if(_.isNull(tstaskId) || _.isEmpty(tstaskId)) {
				var errorMsg = { text: 'error.parte_tareaNull' };
				this.showErrorMessage($('#errors-productiveForm', this.el), errorMsg);
				return;
			}

			var self = this,
				tstaskOut = this.tasksCombo.get(tstaskId),
				intervals = this.productiveCol.models.concat(this.tsNoProductive.models),
				result = comprobarIntervalosTarea(this.tsTasks, intervals, tstaskOut);

			if(result === null){
				$("#tasksoutoflist option", this.el).attr("selected",false);
				$("#tasksoutoflist option:first", this.el).attr("selected","selected");

				this.tsTasks.add(tstaskOut);
				//afegir també els intervals de la tasca a productiveCol
				self.productiveCol.add(tstaskOut.get('tsproductivetime').models);
				this.tasksCombo.remove(tstaskOut);
			}
			else {
				var errorsolapa = {error: { text: result, i18n: false }};
				this.showErrorMessage($('#errors-productiveForm', this.el), errorsolapa);
			}
		}
	});

	var ProductiveContent = Backbone.View.extend({
		subviews: {},

		initialize:function(){
			this.template = _.template(productiveContentTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();
			this.renderSubViews(eventName);
			return this;
		},

		renderSubViews: function (eventName) {
			this.subviews.productiveForm = new ProductiveForm({
				el:$('#productive-form', this.el),
				model: this.options.model,
				productiveCol: this.options.productiveCol
			}).render();

			this.subviews.productiveListView = new ProductiveHourListView({
				el:$('#content-prod-list', this.el),
				model: this.options.model,
				parent: this,
				productiveCol: this.options.productiveCol
			}).render();
		},

		showEditIntervalPopup: function (model){
			this.options.parent.openIntervalsPopup(model);
		},

		addToCombo: function (model) {
			if (!_.isUndefined(model)) {
				this.subviews.productiveForm.addToCombo(model);
			}
		}
	});

	return ProductiveContent;
});