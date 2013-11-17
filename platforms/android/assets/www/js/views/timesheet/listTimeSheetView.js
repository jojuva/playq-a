define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit', 'utils','moment', 'views/dialogs/confirmationPopup', "models/global/timeSheetGlobal", "models/timesheet/timeSheet", 'models/task', 'text!templates/timesheet/listTimeSheet.html', 'text!templates/timesheet/timeSheetItemList.html', 'jqm'],
	function($, _, Backbone, stickit, utils, moment, ConfirmationPopup, TimeSheetGlobal, TimeSheet,  Task, listTimeSheetTpl, timeSheetItemListTpl) {

	var TimeSheetItemList = Backbone.View.extend({
		subviews: {},
		parent: null,
		bindings:{
			'#timesheetdate' : {
				observe: 'date',
				onGet: 'dateFormat'
			},
			'#status' : {
				observe: 'status',
				onGet: 'setStatusDesc'
			}
		},
		dateFormat: function(value){
			if (!_.isNull(value)){
				if(!_.isString(value)){
					value = value.toString();
				}
				return moment(value, "YYYYMMDD").format('DD/MM/YYYY');
			}else{
				return '-';
			}
		},
		setStatusDesc: function(value){
			if(!_.isNull(value) && !_.isUndefined(value)){
				if(value === TIMESHEETSTATUS.ABIERTO ){
					$("#status", this.el).addClass("abierto");
					return $.t("timesheet.abierto");
				}else{
					$("#status", this.el).addClass("finalizado");
					return $.t("timesheet.finalizado");
				}

			}else{
				return '-';
			}
		},
		tagName: 'li',

		initialize: function() {
			this.template = _.template(timeSheetItemListTpl);
			this.subviews.confirmationPopup = new ConfirmationPopup();
			this.parent = this.options.parent;
			//this.model.bind('remove', this.remove);
		},

		render: function (eventName) {
			$(this.el).html(this.template({ timesheet: this.model.toJSON() })).i18n();
			$(this.el).trigger('create');
			this.stickit();
			this.renderPopups();
			return this;
		},

		renderPopups: function (eventName){
			this.$el.append(this.subviews.confirmationPopup.render().el);
		},

		events : {
			"click a[id^=edit-timesheet-]" : "editTimeSheet",
			"click a[id^=delete-timesheet-]" : "deleteTimeSheet"
		},

		editTimeSheet: function(event){
			this.parent.showEditTimeSheet(this.model);
		},

		deleteTimeSheet: function(event){
			var self= this;
			this.subviews.confirmationPopup.openPopup('dialog.delete', 'dialog.deleteTimeSheetText', function() {
				$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
				self.parent.deleteTimeSheet(self.model);
            });
		}

	});

	var ListTimeSheetView = Backbone.View.extend({
		parent : null,

		initialize:function () {
			this.template = _.template(listTimeSheetTpl);
			this.collection.bind("add, reset, delete, change", this.render, this);
			this.collection.bind("repintar", this.renderTimesheet, this);
			this.parent = this.options.parent;
		},

		render:function (eventName) {
			//mirem si la collection té timesheets o no i li passem al template
			this.renderTimesheet();
			
			return this;
		},

		renderTimesheet: function (eventname) {
			var empty = (this.collection.models.length === 0) ? 1: 0;
			$(this.el).html(this.template({empty: empty})).i18n();

			if(empty === 0){
				$timesheetList = $('#timeSheetList', this.el);
				this.addTimeSheetToList($timesheetList, this.collection.models);
			}
			
			$(this.el).trigger('create');
		},

		addTimeSheetToList: function ($container, timesheets) {
			var self = this;

			if (timesheets.length === 0) {
				$('#no-timesheet', this.el).show();
				return;
			}
			$('#timeSheetList', this.el).show();
			$('#no-timesheet', this.el).hide();
			_.each(timesheets, function (timesheet) {
				$container.append(new TimeSheetItemList({ model: timesheet, parent: self }).render().el);
			});
			try {
				$container.listview('refresh');
			} catch(e) {

			}
		},

		deleteTimeSheet: function(model){

			var timeSheetGlobal = new TimeSheetGlobal({timeSheet: new TimeSheet({timesheetid : model.get('timesheetid')})}),
				self = this,
				tscollection = this.collection;
				
                timeSheetGlobal.fetch({
                    success: function(){
                    	timeSheetGlobal.deleteData({
                            success: function () {
                                if (!_.isUndefined(tscollection)){
									tscollection.fetch({
										success: function () {
											tscollection.trigger('repintar');
											$.mobile.loading('hide');
										}
									});
								}
                            },
                            error: function () {
                                execError(ERROR.ERROR_DELETE_DATA);
                                self.parent.showErrorsPopup(ERROR.ERROR_DELETE_DATA, "Delete TimeSheetGlobal - listTimeSheetView");
                            }
                        });
                    },
                    error: function(){
                    	execError(ERROR.ERROR_FETCH_DATA);
                    	self.parent.showErrorsPopup(ERROR.ERROR_FETCH_DATA, "Fetch TimeSheetGlobal - listTimeSheetView");
                    }
                });
		},

		showEditTimeSheet: function(model){
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			app.navigate("editTS/"+model.id, true);
		}
	});

	return ListTimeSheetView;

});