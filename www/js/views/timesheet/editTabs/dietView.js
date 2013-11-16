define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'text!templates/timesheet/editTabs/dietForm.html', 'jqm'],
	function($, _, Backbone, stickit, dietFormTpl) {

	var DietForm = Backbone.View.extend({

		bindings:{
			"#expenses" : {
				observe: "expenses",
				onSet: "onSetDiet",
				onGet: "onGetDiet"
			}
		},

		onGetDiet: function(value){
			if (!_.isNull(value)) {
				if(_.isEmpty(value)){
					return 0;
				}
				return value.toString().replace(".", ",");
			}
			else {
				return null;
			}
		},

		onSetDiet: function(value){
			if (!_.isNull(value) && !_.isEmpty(value)) {
				return parseFloat(value.replace(/'|’|,/, ".")).toFixed(2);
			}
			else {
				if(_.isEmpty(value)){
					return 0;
				}
				return null;
			}
		},

		initialize:function () {
			this.template = _.template(dietFormTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();
			this.stickit();
			return this;
		},

		events : {
			"click a.ui-input-clear" : "deleteDiet"
		},

		deleteDiet: function(event){
			event.preventDefault();
			event.stopPropagation();

			$('#expenses', this.el).val(0);
		}
	});

	return DietForm;
});