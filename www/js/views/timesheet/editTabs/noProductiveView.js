define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'moment', 'models/timesheet/TSNoProductive', 'views/timesheet/editTabs/formIntervals', 'views/timesheet/editTabs/listIntervals', 'text!templates/timesheet/editTabs/noProductive/noProductiveContent.html', 'jqm'],
	function($, _, Backbone, stickit, moment, TSNoProductive,EditIntervalForm, EditIntervalListView, noProductiveContentTpl) {

	var NoProductiveContent = Backbone.View.extend({
		subviews: {},

		initialize:function(){
			this.template = _.template(noProductiveContentTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();

			this.subviews.editIntervalForm = new EditIntervalForm({
				el:$('#noProductive-form', this.el),
				timeSheetHourTypeCol: this.options.timeSheetHourNoProdTypeCol,
				modelTask: null,
				tstaskCol: this.options.model.get('tsTask'),
				presenceAux: this.model.get('tsNoProductive'),
				tsNoProdCol: this.options.productiveCol,
				timesheet: this.model.get('timeSheet'),
				typeInt: INTERVAL.NO_PRODUCTIVE
			}).render();
			this.subviews.editIntervalForm.resetForm();

			this.subviews.editIntervalListView = new EditIntervalListView({
				el:$('#content-list', this.el),
				model: null,
				timeSheetHourTypeCol: this.options.timeSheetHourNoProdTypeCol,
				parent: this,
				presenceAux: this.model.get('tsNoProductive'),
				typeInt: INTERVAL.NO_PRODUCTIVE
			}).render();
			
			return this;
		},

		editInterval: function (model) {
			this.subviews.editIntervalForm.renderEdit(model);
		}
	});

	return NoProductiveContent;
});
