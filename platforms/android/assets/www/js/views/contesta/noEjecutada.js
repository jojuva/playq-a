define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend', 'utils', 'views/headerView', 'views/dialogs/alertPopup', 'views/contesta/pestanyes/presence', 'views/contesta/pestanyes/operators', 'views/contesta/pestanyes/motivoNoEjecucion', 'text!templates/jqmPage.html', 'text!templates/contesta/contestaForm.html', 'text!templates/contesta/motivoNoEjecucionTarea.html', 'text!templates/contesta/errorItem.html', 'jqm'],
	function($, _, Backbone, stickit, utils, Header, AlertPopup, Presence, Operators, MotivoNoEjecucion, jqmPageTpl, contestaFormTpl, motivoNoEjecucionTareaTpl, errorItemTpl) {

	//COS DE CONTESTA - NO EJECUTADA
	var NoEjecutadaContent = Backbone.View.extend({
		taskGlobal: null,
		task: null,
		subviews: {},

		initialize: function () {
			this.template = _.template(contestaFormTpl);
			this.taskGlobal = this.options.taskGlobal;
			if (!_.isUndefined(this.taskGlobal)) {
				this.task = this.taskGlobal.get('task');
			}
			this.subviews.alertPopup = new AlertPopup();
			this.taskGlobal.on("invalid", function (errors) {
				scroll(0);
				$.mobile.loading('hide');
				this.showErrorMessage($('#errors-form-contesta', this.el), errors);
				this.showErrors(errors);
			}, this);
			this.initTask();
		},

		render: function () {
			$(this.el).html(this.template(this.getTplData())).i18n();

			this.renderMotivoNoEjecucion();

			var forms = this.taskGlobal.get('form');
			if (!forms.isEmpty()) {
				this.renderPresence(forms);
				this.renderOperarios(forms);
			}
			this.renderPopups();

			this.printRequiredLabels();
			return this;
		},

		getTplData: function () {
			var msg = [this.task.get('taskdescription'), this.task.get('tasktypedesc'), this.task.get('ottypedesc')];
			msg = _.union(_.compact(msg));
			return {
				originid: this.task.get('originid'),
				desc: _.union(_.compact(msg)).join(", "),
				address: this.task.get('completeaddress')
			};
		},

		renderPopups: function () {
			this.$el.append(this.subviews.alertPopup.render().el);
		},

		renderMotivoNoEjecucion: function() {
			this.subviews.motivoNoEjecucion = new MotivoNoEjecucion({
				model: this.task,
				motivosNoEj: this.taskGlobal.get('nonExecutiveTask')
			});
			this.$el.append(this.subviews.motivoNoEjecucion.render().el);
		},

		renderPresence: function(forms) {
			var presences = forms.findWhere({formcode: PESTANYAS.FPRESENCIAS});
			if(!_.isUndefined(presences)){
				//pestanya Duración 
				this.subviews.presence = new Presence({
					collection : this.taskGlobal.get('presence'),
					task: this.task,
					edited: presences.get('edited')
				});
				this.$el.append(this.subviews.presence.render().el);
			}
		},

		renderOperarios: function(forms) {
			var operators = forms.findWhere({formcode: PESTANYAS.FOPERARIOS});
			if(!_.isUndefined(operators)){
				//pestanya Operarios
				this.subviews.operators = new Operators({
					operatortask: this.taskGlobal.get('operatorTask'),
					collection : this.options.operarios,
					task: this.task,
					edited: operators.get('edited')
				});
				this.$el.append(this.subviews.operators.render().el);
			}
		},

		events: {
			"focus .ui-collapsible-content :input" : "actionMarker",
			"change .ui-collapsible-content select" : "actionMarker",
			"change .ui-collapsible-content :checkbox" : "actionMarker",
			"btnClick .ui-collapsible-content form .ui-btn" : "actionMarker",
			"btnClick .ui-collapsible-content .ui-listview .ui-btn" : "actionMarker",
			"focusout .ui-input-text" : "scrollAjustInput",
			"vclick .ui-collapsible h4 a.ui-btn" : "collapsibleToogle"
		},

		collapsibleToogle: function(event) {
			event.preventDefault();
			event.stopPropagation();
			var $collapsible = $(event.currentTarget).closest('div');
			if ($collapsible.hasClass('ui-collapsible-collapsed')) {
				$collapsible.trigger('expand');
			} else {
				$collapsible.trigger('collapse');
			}
		},

		actionMarker: function(event) {
			var $marker = $(event.currentTarget).closest(".ui-collapsible").find(".action-marker:hidden").first();
			if ($marker.length > 0) {
				$marker.show();
				if (!_.isUndefined(pestanya = $marker.data().formcode)) {
					var form = this.taskGlobal.get('form').findWhere({formcode: pestanya});
					if (!_.isUndefined(form)) {
						form.set({ edited: "true" });
					}
				}
			}
		},

		scrollAjustInput: function() {
			if (isIOS()) {
				setTimeout(function() {
					if ($('.ui-input-text', this.el).is(':focus'))
						return;
					$.mobile.silentScroll(window.pageYOffset);
				}, 50);
			}
		},

		showFotosAction: function (){
			app.navigate('fotos/' + this.task.get('taskid'), true);
		},

		goToMap: function () {
			openMap({ address: this.task.get('completeaddress') });
		},

		initTask: function() {
			//Si la tasca no està iniciada - la iniciem
			var now = moment().format("YYYY-MM-DDTHH:mm");
			if(_.isNull(this.task.get('initialdatereal'))){
				this.task.set({initialdatereal: now+':00'});
			}
		},

		save: function () {
			var self=this;
			$('#errors-form-contesta', this.el).hide();
			$.mobile.loading('show', {text: $.t("loading.save"), textVisible: true, html: "", theme: "f"});
			var nonExecutionMotiveID = $('#motivos option:selected', self.el).val();
			//posem també l'status a No Ejecutada i statustm a Guardad
			this.task.set({
				nonexecutivemotiveid: nonExecutionMotiveID,
				status: TASKSTATUS.NONEXECUTIVE,
				tmstatus: TASKSTATUSSYNC.GUARDADA
			});
			this.taskGlobal.save({
				success: function (model) {
					console.log("saved: NoEjecutiveTask");
					self.subviews.alertPopup.openPopup('info.saveSyncDataTitle', 'info.saveSyncDataOk');
					$.mobile.loading('hide');
				},
				error: function (errorType) {
					if(errorType === ERROR.ERROR_SAVE_DATA){
						self.subviews.alertPopup.openPopup('error.saveDataTitle', 'error.saveDataError');
					}else{
						self.subviews.alertPopup.openPopup('info.saveSyncDataTitle', 'info.saveSyncDataOk');
					}
					$.mobile.loading('hide');
				}
			});
		},

		answer: function() {
			var self=this,
				now = moment().format("YYYY-MM-DDTHH:mm:ss"),
				initial = this.task.get('initialdatereal');

			$('#errors-form-contesta', this.el).hide();
			$.mobile.loading('show', {text: $.t("loading.syncro"), textVisible: true, html: "", theme: "f"});
			var nonExecutionMotiveID = $('#motivos option:selected', self.el).val();

			//mirem si la initialdatreal està posada
			if(!_.isNull(initial) && !_.isUndefined(initial)){
				initial = now;
			}

			var duration = moment(now).diff(moment(initial), 'minutes');
			this.task.set({
				operatorid: window.localStorage.getItem(LS_OPERATOR_ID),
				nonexecutivemotiveid: nonExecutionMotiveID,
				status: TASKSTATUS.NONEXECUTIVE,
				tmstatus: TASKSTATUSSYNC.FINALIZADA,
				startdatereplytask: initial,
				finaldatereplytask: now,
				taskduration: duration,
				initialdatereal: initial,
				finaldatereal: now
			});
			//existatachment:
			var fotoPath = '';
			if (!isIOS()) {
				fotoPath = window.localStorage.getItem(LS_FPATH);
			}
			existFiles(fotoPath + this.task.get('taskid'), {
				success: function(){
					self.task.set({ existatachmentfromtm: 1 });
					self.syncroAnswer();
				},
				error: function(){
					self.task.set({ existatachmentfromtm: 0 });
					self.syncroAnswer();
				}
			});
		},

		syncroAnswer: function () {
			var self = this;
			this.taskGlobal.answer({
				success: function (model) {
					console.log("answer: NonEjecutiveTask");
					app.navigate("tareas", true);
				},
				error: function (errorType) {
					if(errorType === ERROR.ERROR_SAVE_DATA){
						self.subviews.alertPopup.openPopup('error.saveDataTitle', 'error.saveDataError');
						$.mobile.loading('hide');
					}else {
						//no s'ha pogut sincronitzar
						app.navigate("tareas", true);
					}

				},
				validate: true
			});
		}
	});

	var NoEjecutadaPage = Backbone.View.extend({
		idPage: ID_PAGE.CONTESTA_NO_EJ,
		subviews: {},

		initialize:function () {
			this.template = _.template(jqmPageTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));

			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'tareas.title',
				idPage: this.idPage,
				confirmBackBtn: true,
				menuBtns: this.initMenuHeaderBtns(),
				headerExtraBtns: this.initHeaderExtraBtns()
			}).render();

			this.subviews.noEjecutadaContent = new NoEjecutadaContent({
				el: $('#page-content', this.el),
				taskGlobal: this.options.taskGlobal,
				operarios: this.options.OperatorCollections
			}).render();

			return this;
		},

		initMenuHeaderBtns: function () {
			var self = this,
				btnsMenu = [],
				task = this.options.taskGlobal.get('task');

			//Si la tarea ya esta contestada - ni guardar ni contesar //TODO mapa i fotos ?
			if (task.get('tmstatus') !== TASKSTATUSSYNC.FINALIZADA) {
				if (!isTablet()){
					btnsMenu.push({id: 'btn_guardar', icon: 'save', text: 'menuList.guardar',action: function (event) { self.save(); }});
				}
			}

			return btnsMenu.concat([
				{id: 'btn_fotos', icon: 'camera', text: 'menuList.fotos', confirmation: true, action: function (event) { self.showFotosAction(); }},
				{id: 'btn_mapa', icon: 'map-marker', text: 'menuList.mapa', action: function(event){ self.goToMap(); }}
			]);
		},

		initHeaderExtraBtns: function () {
			var self = this,
				btnsMenu = [],
				task = this.options.taskGlobal.get('task');

			if (task.get('tmstatus') === TASKSTATUSSYNC.FINALIZADA)
				return undefined;

			if (isTablet()) {
				btnsMenu.push({id: 'btn_guardar', icon: 'save', text: 'menuList.guardar',action: function (event) { self.save(); }});
			}
			return btnsMenu.concat([
				{id: 'btn_contestar', icon: 'external-link', text: 'menuList.contestar', action: function (event) { self.answer(); }}
			]);
		},

		save: function () {
			this.subviews.noEjecutadaContent.save();
		},

		answer: function(){
			this.subviews.noEjecutadaContent.answer();
		},

		showFotosAction: function(){
			this.subviews.noEjecutadaContent.showFotosAction();
		},

		goToMap: function () {
			this.subviews.noEjecutadaContent.goToMap();
		}
	});
	return NoEjecutadaPage;

});