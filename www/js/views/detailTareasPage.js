define(['jquery', 'underscore.extend', 'backbone.extend', 'views/headerView', 'views/dialogs/contestaPopup', 'views/dialogs/confirmationPopup', 'views/listtask/detailTaskView', 'text!templates/jqmPage.html', 'jqm'],
	function($, _, Backbone, Header, ContestaPopup, ConfirmationPopup, DetalleTareaView, jqmPageTpl) {

	var DetalleTareaPage = Backbone.View.extend({
		idPage: ID_PAGE.DET_TAREA,
		taskGlobal: null,
		subviews: {},

		initialize:function () {
			this.template = _.template(jqmPageTpl);
			this.taskGlobal = this.options.taskGlobal;
			this.subviews.confirmationPopup = new ConfirmationPopup();
			this.subviews.contestaPopup = new ContestaPopup();
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));
			this.renderPopup();

			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'tareas.title',
				idPage: this.idPage,
				menuBtns: this.initMenuHeaderBtns(),
				headerExtraBtns: this.initHeaderExtraBtns()
			}).render();

			this.subviews.detalleTareaView = new DetalleTareaView({
				el: $('#page-content', this.el),
				taskGlobal: this.taskGlobal
			}).render();

			return this;
		},

		renderPopup: function () {
			this.$el.append(this.subviews.confirmationPopup.render().el);
			this.$el.append(this.subviews.contestaPopup.render().el);
		},

		initMenuHeaderBtns: function () {
			var self = this,
				isAdmin = window.localStorage.getItem(LS_IS_ADMIN);

			if (isAdmin === "1")
				return [{id: 'btn_logout', icon: 'off', text: 'menuList.logout', url: 'login' }];

			if(!_.isUndefined(tg = this.taskGlobal) && !_.isNull(task = tg.get('task')) && task.get('tmstatus') === TASKSTATUSSYNC.FINALIZADA){
				return [
					{id: 'btn_fotos', icon: 'camera', text: 'menuList.fotos', action: function (event) { self.showFotosAction(); }},
					{id: 'btn_mapa', icon: 'map-marker', text: 'menuList.mapa', action: function(event){ self.goToMap(); }}
				];
			}
			return [
				{id: 'btn_contestar', icon: 'edit', text: 'menuList.contestar', action: function (event) { self.contestaAction(); }},
				{id: 'btn_fotos', icon: 'camera', text: 'menuList.fotos', action: function (event) { self.showFotosAction(); }},
				{id: 'btn_mapa', icon: 'map-marker', text: 'menuList.mapa', action: function(event){ self.goToMap(); }}
			];
		},

		initHeaderExtraBtns: function () {
			var self = this,
				isAdmin = window.localStorage.getItem(LS_IS_ADMIN);

			if (isAdmin === "1")
				return [];

			if(!_.isUndefined(tg = this.taskGlobal) && !_.isNull(task = tg.get('task')) && task.get('tmstatus') === TASKSTATUSSYNC.FINALIZADA){
				return [];
			}

			return [
				{id: 'btn_iniciar', icon: 'time', text: 'menuList.iniciar', action: function(event) { self.askIniciaAction(); } }
			];
		},

		askIniciaAction: function () {
			this.subviews.detalleTareaView.askIniciaAction(this.subviews.confirmationPopup);
		},

		contestaAction: function () {
			this.subviews.detalleTareaView.contestaAction(this.subviews.contestaPopup);
		},
		showFotosAction: function () {
			this.subviews.detalleTareaView.showFotosAction();
		},
		goToMap: function () {
			this.subviews.detalleTareaView.goToMap();
		}
	});
	return DetalleTareaPage;
});