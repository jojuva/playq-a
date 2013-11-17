define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'text!templates/contesta/motivoNoEjecucionTarea.html', 'jqm'],
	function($, _, Backbone, stickit, motivoNoEjecucionTareaTpl) {

	//combo Motivo de no ejecucion
	var MotivoNoEjecucion = Backbone.View.extend({
		bindings: {
			'#motivos': {
				observe: 'nonexecutivemotiveid',
				selectOptions: {
				collection: 'this.options.motivosNoEj',
				labelPath: 'nonexecutionmotivedescription',
				valuePath: 'nonexecutionmtiveid',
					defaultOption: {
						label: $.t("select.defaultLabel"),
						value: null
					}
				}
			},
			"#commentstechnicaloperator" : "commentstechnicaloperator"
		},

		initialize:function () {
			this.template = _.template(motivoNoEjecucionTareaTpl);
		},

		render:function (eventName) {
			var editedMotivo = (!_.isNull(this.model.get('nonexecutivemotiveid')) || !_.isNull(this.model.get('commentstechnicaloperator')));
			$(this.el).html(this.template({edited: editedMotivo.toString()})).i18n();
			this.stickit();
			return this;
		}
	});

	return MotivoNoEjecucion;
});