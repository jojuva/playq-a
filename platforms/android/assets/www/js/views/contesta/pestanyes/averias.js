define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'text!templates/contesta/averiasForm.html', 'jqm'],
	function($, _, Backbone, stickit, averiasFormTpl) {

	var AveriasForm = Backbone.View.extend({

		bindings:{
			"#failuretype" : {
				observe: "failuretypeid",
				selectOptions: {
					collection: 'this.options.failures',
					labelPath: 'description',
					valuePath: 'failuretypeid',
					defaultOption: {
						label: $.t("select.defaultLabel"),
						value: null
					}
				}
			}
		},

		initialize:function () {
			this.template = _.template(averiasFormTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({edited: this.options.edited})).i18n();
			this.stickit();
			return this;
		}
	});

	return AveriasForm;
});