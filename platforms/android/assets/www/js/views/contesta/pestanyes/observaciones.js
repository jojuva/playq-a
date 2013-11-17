define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'text!templates/contesta/observacionesForm.html', 'jqm'],
	function($, _, Backbone, stickit, observacionesFormTpl) {

	var ObservacionesForm = Backbone.View.extend({
		bindings:{
			"#commentstechnicaloperator" : "commentstechnicaloperator"
		},
		initialize:function () {
			this.template = _.template(observacionesFormTpl);
		},
		render:function (eventName) {
			$(this.el).html(this.template({edited: this.options.edited})).i18n();
			this.stickit();
			return this;
		}

	});

	return ObservacionesForm;
});