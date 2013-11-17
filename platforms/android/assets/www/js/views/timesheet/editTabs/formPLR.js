define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'moment','mobiscroll', 'models/timesheet/TSTask', 'text!templates/timesheet/editTabs/plr/editPopup/editPLRFormPopup.html', 'jqm'],
	function($, _, Backbone, stickit, moment, mobiscroll, TSTask, editPLRFormPopupTpl) {

	var FormPLR = Backbone.View.extend({
		tsTask: null,
		bindings:{
			'#numFailures': {
				observe: 'asbestosCuts',
				onGet: 'getFailures',
				onSet: 'parseInteger'
			},
			'#durationFailures' : {
				observe: 'asbestosDuration',
				onGet: 'dateFormat',
				onSet: 'setDateFormat'
			},
			'#expoFailures' : {
				observe: 'asbestosExposition',
				onGet: 'dateFormat',
				onSet: 'setDateFormat'
			},
			'.confinedSpaces': {
				observe: 'confinedSpaces',
				onGet: 'radioChecked',
				onSet: 'setBoolean'
			}
		},
		setDateFormat: function(value){
			if(!_.isNull(value)){
				var milisec = moment.duration(moment(value, "HH:mm"))._milliseconds;
				return parseInt(milisec/60000, 10);
			}
		},
		dateFormat: function(value){
			if (!_.isNull(value)){
				value = value*60000;
				return moment.utc(value).format('HH:mm');
			} else {
				return '00:00';
			}
		},
		getFailures: function(value) {
			if(_.isNull(value) || _.isNaN(value)){
				return 0;
			}
			return value;
		},
		parseInteger: function(value){
			if(!_.isNull(value) && !_.isEmpty(value)){
				return parseInt(value, 10);
			}
			return 0;
		},
		radioChecked: function(value){
			if(!_.isNull(value)){
				if(value.toString() == "true"){
					$("#space_yes", this.el).prop('checked', true).checkboxradio("refresh");
					$("#space_no", this.el).prop('checked', false).checkboxradio("refresh");
				}else{
					$("#space_no", this.el).prop('checked', true).checkboxradio("refresh");
					$("#space_yes", this.el).prop('checked', false).checkboxradio("refresh");
				}
			}
			return value;
		},
		setBoolean: function (value) {
			if(!_.isNull(value)){
				return JSON.parse(value);
			}
		},

		initialize: function () {
			this.template = _.template(editPLRFormPopupTpl);
			this.tsTask = this.options.model;
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();
			this.stickit();
			this.renderMobiscroll();
			return this;
		},

		renderMobiscroll: function() {
			renderMobiscrollTime({inputs: [ $('#durationFailures', this.el), $('#expoFailures', this.el) ]});
		},

		validateForm: function(){
			var errors = {},

				duration = (!_.isNull(this.tsTask.get('asbestosDuration')) && this.tsTask.get('asbestosDuration') >0 ),
				exposition = (!_.isNull(this.tsTask.get('asbestosExposition')) && this.tsTask.get('asbestosExposition') > 0 ),
				emptyCuts = (_.isNull(this.tsTask.get('asbestosCuts')) || this.tsTask.get('asbestosCuts') === 0 || _.isNaN(this.tsTask.get('asbestosCuts')));

			if(( duration || exposition) && (emptyCuts)) {
				//s'ha posat data de exposició o duració sense informar numero de cortes
				var errorMsg = { text: 'error.validation.cortes' };
				this.showErrorMessage($('#errors-formprl', this.el), errorMsg);
				return false;
			}
			return true;
		},

		resetForm: function(){
			this.hideErrorMessage($('#errors-formprl', this.el));
			this.unstickit();
			this.stickit();
		},

		events: {
			"focusout #numFailures" : "resetNumFailures"
		},

		resetNumFailures: function (event) {
			var failures = $(event.currentTarget).val();
			if (_.isEmpty(failures)) {
				this.model.set({asbestosCuts: parseInt(0, 10)});
				$(event.currentTarget).val('0');
			}
		}
	});
	return FormPLR;
});