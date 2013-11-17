define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'text!templates/timesheet/editTabs/observationForm.html', 'jqm'],
	function($, _, Backbone, stickit, observationFormTpl) {

	var ObservationForm = Backbone.View.extend({

		bindings:{
			"#observation" : {
				observe: "observation"
			}
		},

		initialize:function () {
			this.template = _.template(observationFormTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();
			this.stickit();
			return this;
		}
	});

	return ObservationForm;
});