define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/resumenTareas/resumenTareas.html', 'jqm'],
	function($, _, Backbone, stickit, Header, jqmPageTpl, resumenTpl) {

	var ResumenTareasContent = Backbone.View.extend({

		initialize: function () {
			this.template = _.template(resumenTpl);
			this.tplData = {
				comercialPendents: 0,
				comercialContestades: 0,
				obraPendents: 0,
				obraContestades: 0,
				gotPendents: 0,
				gotContestades: 0,
				revisionPendents: 0,
				revisionContestades: 0,
				reparacionesPendents: 0,
				reparacionsContestades: 0,
				correctivoPendents: 0,
				correctivoContestades: 0,
				parteControlPendents: 0,
				parteControlContestades: 0,
				averiasPendents: 0,
				averiasContestades: 0
			};
		},

		render: function () {
			this.updateTplData();
			$(this.el).html(this.template(this.tplData)).i18n();
			return this;
		},

		updateTplData: function() {
			var self = this;
			_.extend(this.tplData, this.collection.countBy(function(model) {
				var classcode = model.get('classcode'),
					status = (model.get('tmstatus') !== TASKSTATUSSYNC.FINALIZADA) ? 'Pendents' : 'Contestades';

				if (classcode === 1) {
					return 'comercial' + status;
				} else if (classcode === 2) {
					return 'obra' + status;
				} else if (classcode === 3) {
					return 'got' + status;
				} else if (classcode === 4) {
					return 'revision' + status;
				} else if (classcode === 5) {
					return 'reparaciones' + status;
				} else if (classcode === 6) {
					return 'correctivo' + status;
				} else if (classcode === 7) {
					return 'parteControl' + status;
				}
			}));

			_.extend(this.tplData, this.collection.countBy(function(model) {
				if (model.get('isfailure') === "true") {
					var status = (model.get('tmstatus') !== TASKSTATUSSYNC.FINALIZADA) ? 'Pendents' : 'Contestades';
					return 'averias' + status;
				}
			}));
		}
	});

	var ResumenTareasPage = Backbone.View.extend({
		idPage: ID_PAGE.RESUMEN_TAREAS,
		subviews: {},

		initialize:function () {
			this.template = _.template(jqmPageTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));

			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				idPage: this.idPage,
				showMenuListBtn: false
			}).render();

			this.subviews.resumenTareasContent = new ResumenTareasContent({
				el: $('#page-content', this.el),
				collection: this.options.taskCollections
			}).render();

			return this;
		}
	});
	return ResumenTareasPage;

});