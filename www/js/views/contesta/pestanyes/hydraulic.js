define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'text!templates/contesta/hydraulicForm.html', 'jqm'],
	function($, _, Backbone, stickit, hydraulicFormTpl) {

	var CloroForm = Backbone.View.extend({

		bindings:{
			"#completeaddress" : "completeaddress",
			"#chlorinereading" : {
				observe: "chlorinereading",
				onSet: "onGetChlor"
			}
		},

		onGetChlor: function(value){
			if (!_.isNull(value) && !_.isEmpty(value)) {
				return parseFloat(value.replace(/'|’|,/, ".")).toFixed(2);
			}
			else {
				return null;
			}
		},

		initialize:function () {
			this.template = _.template(hydraulicFormTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({edited: this.options.edited})).i18n();
			this.stickit();
			return this;
		}
	});

	return CloroForm;
});