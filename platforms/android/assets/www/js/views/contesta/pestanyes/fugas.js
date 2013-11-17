define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'text!templates/contesta/fugasForm.html', 'jqm'],
	function($, _, Backbone, stickit, fugasFormTpl) {

	var FugasForm = Backbone.View.extend({

		bindings:{
			'#totalleaks' : 'totalleaks',
			'#distance' : 'distance'
		},

		initialize:function () {
			this.template = _.template(fugasFormTpl);
			this.model.set({taskid : this.options.task.get('taskid')});
		},

		render:function (eventName) {
			$(this.el).html(this.template({edited: this.options.edited})).i18n();
			this.stickit();
			return this;
		}
	});

	return FugasForm;
});