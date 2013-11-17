define(['jquery', 'underscore.extend', 'backbone.extend', 'views/headerView', 'views/dialogs/confirmationPopup', 'views/listtask/listTaskView', 'text!templates/jqmPage.html', 'jqm'],
	function($, _, Backbone, Header, ConfirmationPopup, ListaTareasView, jqmPageTpl) {

	var ListaTareasPage = Backbone.View.extend({
		idPage: ID_PAGE.TAREAS,
		subviews: {},

		initialize:function () {
			this.template = _.template(jqmPageTpl);
			this.subviews.confirmationPopup = new ConfirmationPopup();
		},
		renderPopups: function () {
			this.$el.append(this.subviews.confirmationPopup.render().el);
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));
			this.renderPopups();
			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'tareas.title',
				idPage: this.idPage,
				showBackBtn: false,
				menuBtns: this.initMenuHeaderBtns(),
				headerExtraBtns: this.initHeaderExtraBtns()
			}).render();

			this.subviews.listaTareasView = new ListaTareasView({
				el: $('#page-content', this.el),
				collection: this.options.taskListCollections
			}).render();
			return this;
		},

		initMenuHeaderBtns: function () {
			var self = this,
				isAdmin = window.localStorage.getItem(LS_IS_ADMIN);

			if (isAdmin === "1") {
				return [
					{id: 'btn_config', icon: 'cog', text: 'menuList.config', url: 'config' },
					{id: 'btn_log', icon: 'file-alt', text: 'menuList.verLog', url: 'logs'},
					{id: 'btn_empty', icon: 'trash', text: 'menuList.vaciar', action: function(event){ self.emptyBD(); }},
					{id: 'btn_logout', icon: 'off', text: 'menuList.logout', url: 'login', confirmation: true, confirmMsg: 'dialog.logoutMsg' }
				];
			}

			return [
				{id: 'btn_resumentareas', icon: 'list-alt', text: 'menuList.resumenTareas', url: 'resumentareas' },
				{id: 'btn_timesheet', icon: 'calendar', text: 'menuList.partes', url: 'timesheets' },
				{id: 'btn_logout', icon: 'off', text: 'menuList.logout', url: 'login', confirmation: true, confirmMsg: 'dialog.logoutMsg' }
			];
		},

		initHeaderExtraBtns: function () {
			var self = this;
			return [
				{id: 'btn_syncro', icon: 'farefresh', text: 'menuList.syncro', action: function (event) { self.syncro(); } }
			];
		},

		syncro: function (event) {
			this.subviews.listaTareasView.syncro(event);
		},
		emptyBD: function (){
			var self= this;
			this.subviews.confirmationPopup.openPopup('dialog.delete', 'dialog.deleteText', function() {
                self.subviews.listaTareasView.emptyBD();
            });
		}

	});
	return ListaTareasPage;
});