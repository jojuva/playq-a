define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit', 'utils','moment', 'views/headerView', 'views/listtask/listTaskView', 'views/listtask/detailTaskView', 'views/dialogs/confirmationPopup', 'views/dialogs/alertPopup', 'views/dialogs/contestaPopup', 'text!templates/jqmPage.html','text!templates/listaDetallesTareas.html', 'text!templates/listaTareas.html', 'text!templates/taskItemList.html', 'jqm'],
	function($, _, Backbone, stickit, utils, moment, Header, ListaTareasView, DetalleTareaView, ConfirmationPopup, AlertPopup, ContestaPopup, jqmPageTpl, listaDetallesTareasTpl, listaTareasTpl, taskItemListTpl) {

	var ListaDetallesContent = Backbone.View.extend({
		subviews: {},

		initialize: function () {
			this.template = _.template(listaDetallesTareasTpl);
		},
		render: function(eventName){
			$(this.el).html(this.template());
			this.subviews.listaTareasView = new ListaTareasView({
				el: $('.content-list', this.el),
				collection: this.options.taskListCollections,
				taskGlobal: this.options.taskGlobal
			}).render();
			this.subviews.detallesTareasView = new DetalleTareaView({
				el: $('.content-details', this.el),
				taskGlobal: this.options.taskGlobal
			}).render();
			return this;
		},

		syncro: function (event) {
			this.subviews.listaTareasView.syncro(event);
		},
		emptyBD: function (){
			this.subviews.listaTareasView.emptyBD();
		},
		askIniciaAction: function (confirmationPopup){
			this.subviews.detallesTareasView.askIniciaAction(confirmationPopup);
		},
		contestaAction: function (contestaPopup){
			this.subviews.detallesTareasView.contestaAction(contestaPopup);
		},
		showFotosAction: function () {
			this.subviews.detallesTareasView.showFotosAction();
		},
		goToMap: function () {
			this.subviews.detallesTareasView.goToMap();
		}

	});

	var ListaDetallesTareasPage = Backbone.View.extend({
		idPage: ID_PAGE.TAREASDETALLES,
		subviews: {},
		btnsDisable: [],
		btnsMenuDisable: [],

		initialize:function () {
			this.template = _.template(jqmPageTpl);
			this.subviews.confirmationPopup = new ConfirmationPopup();
			this.subviews.contestaPopup = new ContestaPopup();
			//_.bindAll(this, "renderHeader");
			if (!_.isUndefined(this.options.taskGlobal)) {
				this.options.taskGlobal.bind("dataFetch change", this.renderHeader, this);
			}
			if(window.localStorage.getItem(LS_IS_ADMIN) !== "1"){
				this.btnsDisable = ["btn_contestar", "btn_iniciar"];
				this.btnsMenuDisable = ["btn_fotos", "btn_mapa"];
			}
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
			this.subviews.listadetallesContent = new ListaDetallesContent({
				el: $('#page-content', this.el),
				taskListCollections: this.options.taskListCollections,
				taskGlobal: this.options.taskGlobal
			}).render();
			this.renderHeader(false);
			return this;
		},
		renderHeader: function(create){
			if (!_.isUndefined(tg = this.options.taskGlobal) && !_.isNull(task = tg.get('task'))){
				if (task.get('tmstatus') === TASKSTATUSSYNC.FINALIZADA) {
					this.subviews.headerView.disableBtn(this.btnsDisable, [], create);
				} else {
					this.subviews.headerView.enbleBtn(this.btnsDisable, this.btnsMenuDisable, create);
				}
			} else {
				this.subviews.headerView.disableBtn(this.btnsDisable, this.btnsMenuDisable, create);
			}
		},

		renderPopups: function () {
			this.$el.append(this.subviews.confirmationPopup.render().el);
			this.$el.append(this.subviews.contestaPopup.render().el);
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
				{id: 'btn_fotos', icon: 'camera', text: 'menuList.fotos', action: function(event) { self.showFotos(); }},
				{id: 'btn_mapa', icon: 'map-marker', text: 'menuList.mapa', action: function(event){ self.goToMap(); }},
				{id: 'btn_timesheet', icon: 'calendar', text: 'menuList.partes', url: 'timesheets' },
				{id: 'btn_logout', icon: 'off', text: 'menuList.logout', url: 'login', confirmation: true, confirmMsg: 'dialog.logoutMsg' }
			];
		},

		initHeaderExtraBtns: function () {
			var self = this,
				isAdmin = window.localStorage.getItem(LS_IS_ADMIN);

			if (isAdmin === "1") {
				return [{id: 'btn_syncro', icon: 'farefresh', text: 'menuList.syncro', action: function (event) { self.syncro(); } }];
			}

			return [
				{id: 'btn_syncro', icon: 'farefresh', text: 'menuList.syncro', action: function (event) { self.syncro(event); } },
				{id: 'btn_contestar', icon: 'edit', text: 'menuList.contestar', action: function (event) { self.contestaAction(); }},
				{id: 'btn_iniciar', icon: 'time', text: 'menuList.iniciar', action: function(event) { self.askIniciaAction(); } }
			];
		},

		syncro: function (event) {
			this.subviews.listadetallesContent.syncro(event);
		},
		emptyBD: function (){
			var self= this;
			this.subviews.confirmationPopup.openPopup('dialog.delete', 'dialog.deleteText', function() {
                self.subviews.listadetallesContent.emptyBD();

            });
		},
		askIniciaAction: function (){
			this.subviews.listadetallesContent.askIniciaAction(this.subviews.confirmationPopup);
		},
		contestaAction: function (){
			this.subviews.listadetallesContent.contestaAction(this.subviews.contestaPopup);
		},
		showFotos: function () {
			this.subviews.listadetallesContent.showFotosAction();
		},
		goToMap: function () {
			this.subviews.listadetallesContent.goToMap();
		},

		events: {
			"updateView" : "updateView",
			"orientationchange" : "orientationchange"
		},

		updateView: function () {
			this.calculateDivDimensions();
		},

		orientationchange: function () {
			this.calculateDivDimensions();
		},

		calculateDivDimensions: function () {
			/*var fixedHeightRight = $('.ui-header').height(),
				fixedHeightLeft = $('.ui-header').height() + $('#navbar', this.el).height(),
				$contentRight = $('.content-details', this.el),
				$contentLeft = $('.list-tareas-container', this.el);

			$contentLeft.height(window.innerHeight - fixedHeightLeft);
			$contentRight.height(window.innerHeight - fixedHeightRight);
			$contentLeft.css('overflow-x', 'auto').css('overflow-y', 'auto');
			$contentRight.css('overflow-x', 'auto').css('overflow-y', 'auto');*/
		}


	});
	return ListaDetallesTareasPage;

});