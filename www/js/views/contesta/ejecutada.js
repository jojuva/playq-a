define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend', 'utils', 'views/headerView', 'views/dialogs/alertPopup', 'views/dialogs/choosePopup', 'views/contesta/pestanyes/meter/meter',
	'views/contesta/pestanyes/presence', 'views/contesta/pestanyes/operators', 'views/contesta/pestanyes/observaciones', 'views/contesta/pestanyes/hydraulic', 'views/contesta/pestanyes/progress', 'views/contesta/pestanyes/averias', 'views/contesta/pestanyes/fugas', 'text!templates/jqmPage.html',
	'text!templates/contesta/contestaForm.html', 'text!templates/contesta/errorItem.html', 'jqm'],
	function($, _, Backbone, stickit, utils, Header, AlertPopup, ChoosePopup, Meter, Presence, Operators, Observaciones, Cloro, Progress, FailureType, HiddenLeaks, jqmPageTpl, contestaFormTpl, errorItemTpl) {


	//COS DE CONTESTA - NO EJECUTADA
	var EjecutadaContent = Backbone.View.extend({
		taskGlobal: null,
		subviews: {},
		statusAnswer: null,
		task: null,

		initialize: function () {
			this.template = _.template(contestaFormTpl);
			this.taskGlobal = this.options.taskGlobal;
			if (!_.isUndefined(this.taskGlobal)) {
				this.task = this.taskGlobal.get('task');
			}
			
			this.subviews.alertPopup = new AlertPopup();
			this.subviews.choosePopup = new ChoosePopup();
			this.taskGlobal.on("invalid", function (errors) {
				scroll(0);
				$.mobile.loading('hide');
				this.showErrorMessage($('#errors-form-contesta', this.el), errors);
				this.showErrors(errors);
			}, this);
			this.statusAnswer = this.options.statusAnswer;
			this.initTask();
		},

		renderPopups: function () {
			this.$el.append(this.subviews.alertPopup.render().el);
			if(this.statusAnswer === TASKSTATUS.PROGRESS){
				this.$el.append(this.subviews.choosePopup.render().el);
			}
		},

		render: function () {
			var forms = this.taskGlobal.get('form');

			$(this.el).html(this.template(this.getTplData())).i18n();

			if (!this.taskGlobal.get('form').isEmpty()) {
				this.renderProgress(forms);
				this.renderCloro(forms);
				this.renderMeter(forms);
				this.renderAverias(forms);
				this.renderFugas(forms);
				this.renderPresence(forms);
				this.renderOperarios(forms);
				this.renderObservaciones(forms);
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

		renderCloro: function(forms) {
			var cloro = forms.findWhere({formcode: PESTANYAS.FCLORO});
			if(!_.isUndefined(cloro)){
				//pestanya Cloro
				this.subviews.cloro = new Cloro({
					model: this.task,
					edited: cloro.get('edited')
				});
				this.$el.append(this.subviews.cloro.render().el);
			}
		},

		renderMeter: function(forms) {
			//mirem si FCONTADORINSTALADO o FCONTACTUALRETIRADO existeixen
			var meterIns = forms.findWhere({formcode: PESTANYAS.FCONTADORINSTALADO});
			var meterUnins = forms.findWhere({formcode: PESTANYAS.FCONTACTUALRETIRADO});
			
			if(!_.isUndefined(meterIns) || !_.isUndefined(meterUnins)){
				this.subviews.meter = new Meter({
					meters: this.taskGlobal.get('meter'),
					isMeterIns : !_.isUndefined(meterIns),
					isMeterUnins: !_.isUndefined(meterUnins),
					editedMeterIns: (!_.isUndefined(meterIns)) ? meterIns.get('edited') : "false",
					editedMeterUnins: (!_.isUndefined(meterUnins)) ? meterUnins.get('edited') : "false",
					brands: this.options.brands,
					models: this.options.models,
					emplacements: this.options.emplacements,
					gauges: this.options.gauges
				});
				this.$el.append(this.subviews.meter.render().el);
			}
		},

		renderPresence: function(forms) {
			var presence = forms.findWhere({formcode: PESTANYAS.FPRESENCIAS});
			if(!_.isUndefined(presence)){
				//pestanya Duración 
				this.subviews.presence = new Presence({
					collection : this.taskGlobal.get('presence'),
					task: this.task,
					edited: presence.get('edited')
				});
				this.$el.append(this.subviews.presence.render().el);
			}
		},

		renderOperarios: function (forms) {
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

		renderObservaciones: function(forms) {
			var observaciones = forms.findWhere({formcode: PESTANYAS.FOBSERVACIONES});
			if(!_.isUndefined(observaciones)){
				//pestanya Observaciones 
				this.subviews.observaciones = new Observaciones({
					model: this.task,
					edited: observaciones.get('edited')
				});
				this.$el.append(this.subviews.observaciones.render().el);
			}
		},

		renderProgress: function(forms) {
			var avance = forms.findWhere({formcode: PESTANYAS.FGRADOAVANCE});
			if(!_.isUndefined(avance) && this.statusAnswer === TASKSTATUS.PROGRESS){
				this.subviews.progress = new Progress({
					progresstask: this.taskGlobal.get('progressTask'),
					task: this.task,
					edited: avance.get('edited')
				});
				this.$el.append(this.subviews.progress.render().el);
			}
		},

		renderAverias: function(forms) {
			var averias = forms.findWhere({formcode: PESTANYAS.FFUGASYAVERIAS});
			if(!_.isUndefined(averias)){
				this.subviews.failure = new FailureType({
					failures: this.options.failures,
					model: this.task,
					edited: averias.get('edited')
				});
				this.$el.append(this.subviews.failure.render().el);
			}
		},

		renderFugas: function(forms) {
			var fugas = forms.findWhere({formcode: PESTANYAS.FBUSCAFUGAS});
			if(!_.isUndefined(fugas)){
				this.subviews.leaks = new HiddenLeaks({
					model: this.taskGlobal.get('taskHiddenLeak'),
					task: this.task,
					edited: fugas.get('edited')
				});
				this.$el.append(this.subviews.leaks.render().el);
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
			var $collapsible = $(event.currentTarget).closest(".ui-collapsible");
			var $marker = $collapsible.find(".action-marker:hidden").first();
			if ($marker.length > 0) {
				$marker.show();
				if (!_.isUndefined(pestanya = $marker.data().formcode)) {
					var form = this.taskGlobal.get('form').findWhere({formcode: pestanya});
					if (!_.isUndefined(form)) {
						form.set({ edited: "true" });
					}
				}
				this.showParentMarkers($collapsible.parent().closest(".ui-collapsible"));
			}
		},

		showParentMarkers: function ($collapsible) {
			var $marker = $collapsible.find(".action-marker:hidden").first();
			while ($marker.length > 0) {
				$marker.show();
				$collapsible = $collapsible.parent().closest(".ui-collapsible");
				$marker = $collapsible.find(".action-marker:hidden").first();
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
			var self = this;
			if (_.isNull(this.task))
				return;

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
			$.mobile.loading('show', {text: $.t("loading.save"), textVisible: true, html: "", theme: "f"});
			//posem també l'status a Ejecutada i tmSync a Guardada
			//posem l'status que hem rebut: pot ser EXECUTIVE o PROGRESS
			this.task.set({status: this.statusAnswer, tmstatus: TASKSTATUSSYNC.GUARDADA});
			this.taskGlobal.save({
				success: function (model) {
					console.log("saved: EjecutiveTask");
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

		_changeTmStatus: function(callback) {
			var self = this;
			//Si la tasca és de tipus EXECUTIVE directament a answer / Si es PROGRESS preguntem si vol borrar del terminal o no
			if(this.statusAnswer === TASKSTATUS.EXECUTIVE){
				this.task.set({ tmstatus : TASKSTATUSSYNC.FINALIZADA, isintm : false});
				callback();
			}
			else if(this.statusAnswer === TASKSTATUS.PROGRESS){
				this.subviews.choosePopup.openPopup('contesta.progress-title', 'contesta.progress-text', 'dialog.si', 'dialog.no',
					function(){
						//Opció Si - No Mantenir la tasca
						self.task.set({ tmstatus : TASKSTATUSSYNC.FINALIZADA, isintm : false});
						callback();
					},
					function () {
						//Opcio No - Mantenir la tasca
						self.task.set({ tmstatus : TASKSTATUSSYNC.GUARDADA, isintm : true});
						callback();
				});
			}
		},

		answer: function() {
			var self=this,
				now = moment().format("YYYY-MM-DDTHH:mm:ss"),
				initial = this.task.get('initialdatereal');

			$('#errors-form-contesta', this.el).hide();

			//mirem si la initialdatreal està posada
			if(!_.isNull(initial) && !_.isUndefined(initial)){
				initial = now;
			}

			var duration = moment(now).diff(moment(initial), 'minutes');
			this.task.set({
				status: this.statusAnswer,
				operatorid: window.localStorage.getItem(LS_OPERATOR_ID),
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
			existFiles(fotoPath + this.task.get('taskid'),
			{
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

		syncroAnswer: function() {
			var self = this;

			if (this.taskGlobal.validateFields()) {
				this._changeTmStatus(function() {
					$.mobile.loading('show', {text: $.t("loading.syncro"), textVisible: true, html: "", theme: "f"});
					self.taskGlobal.answer({
						success: function (model) {
							console.log("answer: EjecutiveTask");
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
						}
					});
				});
			}
		}
	});

	var EjecutadaPage = Backbone.View.extend({
		idPage: ID_PAGE.CONTESTA_EJ,
		subviews: {},
		statusAnswer: null,
		task: null,

		initialize:function () {
			this.template = _.template(jqmPageTpl);
			this.statusAnswer = this.options.statusAnswer;
			this.task = this.options.taskGlobal.get('task');
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

			this.subviews.ejecutadaContent = new EjecutadaContent({
				el: $('#page-content', this.el),
				taskGlobal: this.options.taskGlobal,
				operarios: this.options.OperatorCollections,
				brands: this.options.BrandCollections,
				models: this.options.ModelCollections,
				emplacements: this.options.EmplacementCollections,
				gauges: this.options.GaugeCollections,
				failures: this.options.FailureTypeCollections,
				statusAnswer: this.statusAnswer
			}).render();

			return this;
		},

		initMenuHeaderBtns: function () {
			var self = this,
				btnsMenu = [];
			//Si la tarea ya esta contestada - ni guardar ni contesar //TODO mapa i fotos ?
			if (this.task.get('tmstatus') !== TASKSTATUSSYNC.FINALIZADA) {
				if (!isTablet()){
					btnsMenu.push({id: 'btn_guardar', icon: 'save', text: 'menuList.guardar',action: function (event) { self.save(); }});
				}
			}

			return btnsMenu.concat([
				{id: 'btn_fotos', icon: 'camera', text: 'menuList.fotos', confirmation: true, action: function(event){ self.showFotosAction();}},
				{id: 'btn_mapa', icon: 'map-marker', text: 'menuList.mapa', action: function(event){ self.goToMap(); }}
			]);
		},

		initHeaderExtraBtns: function () {
			var self = this,
				btnsMenu = [];

			if (this.task.get('tmstatus') === TASKSTATUSSYNC.FINALIZADA)
				return undefined;

			if (isTablet()) {
				btnsMenu.push({id: 'btn_guardar', icon: 'save', text: 'menuList.guardar',action: function (event) { self.save(); }});
			}
			return btnsMenu.concat([
				{id: 'btn_contestar', icon: 'external-link', text: 'menuList.contestar', action: function (event) { self.answer(); }}
			]);
		},

		save: function () {
			$('#errors-form-contesta', this.el).hide();
			this.subviews.ejecutadaContent.save();
		},

		answer: function(){
			this.subviews.ejecutadaContent.answer();
		},

		showFotosAction: function(){
			this.subviews.ejecutadaContent.showFotosAction();
		},

		goToMap: function () {
			this.subviews.ejecutadaContent.goToMap();
		}
	});
	return EjecutadaPage;

});