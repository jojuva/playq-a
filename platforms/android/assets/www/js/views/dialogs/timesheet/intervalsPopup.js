define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'moment',  'utils', 'models/timesheet/TSProductive', 'models/timesheet/TSTask', 'collections/timesheet/TSProductiveCollections', 'views/timesheet/editTabs/formIntervals', 'views/timesheet/editTabs/listIntervals', 'text!templates/timesheet/editTabs/productive/editPopup/editIntervalsPopup.html', 'jqm'],
	function($, _, Backbone, stickit, moment, utils, TSProductive, TSTask, TSProductiveCollection, EditIntervalForm, EditIntervalListView, editIntervalsTpl) {

	var EditIntervalsPopup = Backbone.View.extend({
		subviews: {},
		modelTask: null,
		presenceAux: null,
		taskOpened: null,
		productiveCol: null,
		closeCallback: null,

		bindings: {
			"#tstask-accountcode" : {
				observe : "accountCode",
				onGet : 'account'
			},
			"#tstask-desc" : "taskDescription",
			"#tstask-address" :"realAddress"
		},
		account: function(value){
			return value;
		},
		initialize: function () {
			this.template = _.template(editIntervalsTpl);
			this.modelTask = new TSTask();
			this.presenceAux = new TSProductiveCollection();
			this.productiveCol = this.options.productiveCol;
			this.closeCallback = this.options.closeCallback;
		},

		render: function (eventName) {
			$(this.el).html(this.template({})).i18n();
			this.renderSubviews();
			return this;
		},

		renderSubviews: function(){
			this.subviews.editIntervalForm = new EditIntervalForm({
				el:$('#popup-form-interval', this.el),
				timeSheetHourTypeCol: this.options.timeSheetHourTypeCol,
				modelTask: this.modelTask,
				tstaskCol: this.options.timesheet.get('tsTask'),
				tsNoProdCol: this.options.timesheet.get('tsNoProductive'),
				presenceAux: this.presenceAux,
				timesheet: this.options.timesheet.get('timeSheet'),
				typeInt: INTERVAL.PRODUCTIVE
			}).render();
		
			this.subviews.editIntervalListView = new EditIntervalListView({
				el:$('#popup-list-interval', this.el),
				modelTask: this.modelTask,
				timeSheetHourTypeCol: this.options.timeSheetHourTypeCol,
				parent: this,
				presenceAux: this.presenceAux,
				typeInt: INTERVAL.PRODUCTIVE
			}).render();
		},

		openPopup: function (model) {
			this.taskOpened = model;
			this.modelTask.set(model.toJSON());

			this.subviews.editIntervalForm.resetForm();
			this.unstickit();
			this.stickit(this.modelTask, this.bindings);
			this.presenceAux.reset(this.productiveCol.toJSON());
			scroll(0);
			this.$el.show();
		},

		editInterval: function (model) {
			this.subviews.editIntervalForm.renderEdit(model);
		},

		events: {
			"click #cancel-editIntervals" : "cancelAction",
			"click #accept-editIntervals" : "acceptAction"
		},

		cancelAction: function (event) {
			this.closePopup();
		},

		acceptAction: function (event) {
			//fer un reset de la collection tspresencetime de modelTask amb la creada
			this.taskOpened.get('tsproductivetime').reset(this.presenceAux.where({taskId : this.modelTask.get('taskId')}));
			this.taskOpened.trigger("listProdRepaint");
			this.productiveCol.reset(this.presenceAux.toJSON());
			this.closePopup();
		},

		closePopup: function () {
			this.$el.hide();
			if (!_.isUndefined(this.closeCallback) && !_.isNull(this.closeCallback)) {
				this.closeCallback();
			}
		}
	});
	/** Fi POPUP **/
	return EditIntervalsPopup;
});