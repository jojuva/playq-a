define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'moment', 'text!templates/timesheet/editTabs/info.html', 'jqm'],
	function($, _, Backbone, stickit, moment, infoTpl) {

	var InfoBlock = Backbone.View.extend({

		bindings:{
			"#timesheetdate" : {
				observe: "date",
				onGet: "dateFormat"
			},
			"#status" : {
				observe: "status",
				onGet: "statusDesc"
			},
			"#username" : {
				observe: "technicalOperatorId",
				onGet: "userName"
			},
			"#timesheetworkdatetypeid" : {
				observe: "workDateTypeForOUId",
				onGet: "TSWorkType"
			}
		},

		dateFormat: function(value){
			if (!_.isNull(value)){
				if(!_.isString(value)){
					value = value.toString();
				}
				return moment(value, 'YYYYMMDD').format('DD/MM/YYYY');
			}else{
				return '';
			}
		},

		statusDesc: function(value){
			if (!_.isNull(value)){
				if(TIMESHEETSTATUS.ABIERTO === value){
					return $.t('timesheet.abierto');
				}else{
					return $.t('timesheet.finalizado');
				}
			}
		},

		userName: function(value){
			return window.localStorage.getItem(LS_NOM_OPERATOR);
		},

		TSWorkType: function(value){
			if (!_.isUndefined(this.options.timeSheetWorkDateCol) && !_.isNull(this.options.timeSheetWorkDateCol.findWhere({'id': value}))) {
				if(!_.isUndefined(this.options.timeSheetWorkDateCol.findWhere({'id': value}))){
					return this.options.timeSheetWorkDateCol.findWhere({'id': value}).get('description');
				}
			}
			return '-';
		},

		initialize:function () {
			this.template = _.template(infoTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();
			this.stickit();
			return this;
		}
	});

	return InfoBlock;
});