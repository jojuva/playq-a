define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend', 'utils', 'moment', 'views/headerView', 'views/dialogs/contestaPopup', 'views/dialogs/confirmationPopup', 'text!templates/detalleContent.html', 'text!templates/detalleTarea.html', 'text!templates/lecturaTarea.html', 'text!templates/lecturaItemList.html', 'text!templates/citaTarea.html', 'text!templates/citaItemList.html', 'text!templates/deudaTarea.html', 'text!templates/deudaItemList.html','text!templates/comentarioTarea.html', 'text!templates/comentarioItemList.html', 'jqm'],
	function($, _, Backbone, stickit, utils, moment, Header, ContestaPopup, ConfirmationPopup, detalleContentTpl, detalleTareaTpl, lecturaTareaTpl, lecturaItemListTpl, citaTareaTpl, citaItemListTpl, deudaTareaTpl, deudaItemListTpl, comentarioTareaTpl, comentarioItemListTpl) {

	// Pestanya GENERAL
	var DetalleTarea = Backbone.View.extend({

		bindings: {
			"#descripcion" : {
				observe: "taskdescription",
				onGet: "getDescription"
			},
			"#nombre" :"customername",
			"#domicilio" : "completeaddress",
			'#domicilio-comp' : "addresscomplement",
			"#poblacion" : "location",
			"#telefono" : "contacttelephone1",
			"#telefono2" : "contacttelephone2",
			"#ubicacion" : "emplacement",
			"#observacion" : "elementcomment",
			"#ruta" : "geographicalcriterion",
			"#origen" : "originid"

		},
		getDescription : function(value){
			if(_.isNull(value)){
				if(!_.isNull(this.model.get('tasktypedesc')) && !_.isUndefined(this.model.get('tasktypedesc')))
					return this.model.get('tasktypedesc');
				else if(!_.isNull(this.model.get('ottypedesc')) && !_.isUndefined(this.model.get('ottypedesc')))
					return this.modelget('ottypedesc');
				else
					return '-';
			}else{
				return value;
			}
		},
		initialize:function () {
			this.template = _.template(detalleTareaTpl);
			this.title = this.options.title;
		},

		render:function (eventName) {
			$(this.el).html(this.template({ title: this.title, task: this.model.toJSON() })).i18n();
			this.stickit();

			return this;
		}

	});

	// Pestanya LECTURAS
	var ReadingItemList = Backbone.View.extend({
		tagName: 'tr',
		bindings: {
			"#fecha" : {
				observe : ['readingdate', 'yearperiod'],
				onGet : function(value) { return moment(value[0], "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY")+" ("+value[1]+")"; }
			},
			"#lectura" :"register",
			"#consumo" : "consumed"

		},
		initialize: function() {
			this.template = _.template(lecturaItemListTpl);
		},

		render: function (eventName) {
			$(this.el).html(this.template({reading: this.model.toJSON() })).i18n();
			this.stickit();

			return this;
		}

	});

	var LecturaTarea = Backbone.View.extend({
		bindingsMeter: {
			"#num-serial" : "serialnumber"
		},
		initialize:function () {
			this.template = _.template(lecturaTareaTpl);
			this.title = this.options.title;
			this.taskGlobal = this.options.taskGlobal;
		},

		render:function (eventName) {
			$(this.el).html(this.template({ title: this.title})).i18n();
			$readingList = $('#readingRegisterList', this.el);
			this.stickit(this.taskGlobal, this.bindingsMeter);
			this.addReadingToList($readingList, this.collection);

			return this;
		},
		addReadingToList: function ($container, readings) {
			readings.each(function (reading) {
				$container.append(new ReadingItemList({ model: reading }).render().el);
			});
		}

	});

	// Pestanya CITAS
	var CitaItemList = Backbone.View.extend({
		tagName: 'li',
		bindings: {
			"#fecha" : {
				observe : "fromdatetime",
				onGet : "timeDBToDate"
			},
			"#fecha2" : {
				observe : "untildatetime",
				onGet : "timeDBToDate"
			},
			"#comentario" :"textcomment"
		},
		timeDBToDate: function(value){
			return  moment(value, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY");
		},
		initialize: function() {
			this.template = _.template(citaItemListTpl);
		},

		render: function (eventName) {
			$(this.el).html(this.template()).i18n();
			this.stickit();

			return this;
		}

	});

	var CitaTarea = Backbone.View.extend({

		initialize:function () {
			this.template = _.template(citaTareaTpl);
			this.title = this.options.title;
		},

		render:function (eventName) {
			$(this.el).html(this.template({ title: this.title})).i18n();
			$citasList = $('#meetingList', this.el);
			this.addMeetingToList($citasList, this.collection);

			return this;
		},
		addMeetingToList: function ($container, meetings) {
			meetings.each(function (meeting) {
				$container.append(new CitaItemList({ model: meeting }).render().el);
			});
		}

	});

	// Pestanya DEUDAS
	var DeudaItemList = Backbone.View.extend({
		tagName: 'li',
		bindings: {
			"#deuda-total" : {
				observe: "customertotaldebt",
				onGet: 'toEuro'
			},
			"#coste-suministro" : {
				observe: "amountreplacementsupply",
				onGet: 'toEuro'
			}
		},
		toEuro: function(value){
			if(!_.isNull(value)){
				return value.toFixed(4).replace(".", ",")+' €';
			}else{
				return '-';
			}
		},
		initialize: function() {
			this.template = _.template(deudaItemListTpl);
		},

		render: function (eventName) {
			$(this.el).html(this.template({reading: this.model.toJSON() })).i18n();
			this.stickit();

			return this;
		}

	});

	var DeudaTarea = Backbone.View.extend({

		initialize:function () {
			this.template = _.template(deudaTareaTpl);
			this.title = this.options.title;
		},

		render:function (eventName) {
			$(this.el).html(this.template({ title: this.title})).i18n();
			$citasList = $('#commercialList', this.el);
			this.addReadingToList($citasList, this.collection);

			return this;
		},
		addReadingToList: function ($container, commercials) {
			commercials.each(function (commercial) {
				$container.append(new DeudaItemList({ model: commercial }).render().el);
			});
		}

	});

	// Pestanya OBSERVACIONES - COMENTARIOS
	var ComentarioItemList = Backbone.View.extend({
		tagName: 'li',
		bindings: {
			"#fecha" : {
				observe : "datetimeobservation",
				onGet : function(value) {return moment(value, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY");}
			},
			"#comentario" : "textobservation"
		},
		initialize: function() {
			this.template = _.template(comentarioItemListTpl);
		},

		render: function (eventName) {
			$(this.el).html(this.template({reading: this.model.toJSON() })).i18n();
			this.stickit();

			return this;
		}

	});

	var ComentarioTarea = Backbone.View.extend({

		initialize:function () {
			this.template = _.template(comentarioTareaTpl);
			this.title = this.options.title;
		},

		render:function (eventName) {
			$(this.el).html(this.template({ title: this.title})).i18n();
			$comList = $('#commentList', this.el);
			this.addCommentToList($comList, this.collection);

			return this;
		},
		addCommentToList: function ($container, comments) {
			comments.each(function (comment) {
				$container.append(new ComentarioItemList({ model: comment }).render().el);
			});
		}

	});

	//COS DE LA LLISTA DETALLE
	var DetalleTareaView = Backbone.View.extend({
		taskGlobal: null,
		subviews: {},
		progress: null,

		initialize: function () {
			this.template = _.template(detalleContentTpl);
			this.taskGlobal = this.options.taskGlobal;
			if (!_.isUndefined(this.taskGlobal)) {
				this.taskGlobal.bind("dataFetch change", this.render, this);
			}
		},

		setProgress: function () {
			if (!_.isUndefined(this.taskGlobal)) {
				if(!_.isNull(this.taskGlobal.get('form'))){
					this.progress = this.taskGlobal.get('form').findWhere({formcode: PESTANYAS.FGRADOAVANCE});
				}
			}
		},

		render: function () {
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			var titleTaskStr = '';
			this.setProgress();
			
			if (!_.isUndefined(this.taskGlobal)) {
				if (!_.isNull(task = this.taskGlobal.get('task'))) {
					if(!_.isNull(task.get('taskdescription')))
						titleTaskStr = task.get('taskdescription');
					else if(!_.isNull(task.get('tasktypedesc')))
						titleTaskStr = task.get('tasktypedesc');
					else if(!_.isNull(task.get('ottypedesc')))
						titleTaskStr = task.get('ottypedesc');
				}
			}

			$(this.el).html(this.template({ titleTask: titleTaskStr })).i18n();

			if (!_.isUndefined(this.taskGlobal)) {
				this.renderInitialDateReal();
				this.renderSubviews();
			}

			this.$el.trigger('create');
			$.mobile.loading('hide');
			return this;
		},

		renderInitialDateReal: function () {
			var task = this.options.taskGlobal.get('task');
			if (!_.isNull(task)) {
				//Si la task està iniciada, printem també el temps de inici
				var inici = task.get('initialdatereal');
				if(!_.isNull(inici)) {
					var $element = $('.time', this.el);
					$element.find('.time-init').text(moment(inici).format("DD/MM/YYYY HH:mm:ss"));
					$element.show();
				}
			}
		},

		renderSubviews: function () {
			var task = this.options.taskGlobal.get('task');

			if (!_.isNull(task)) {
				this.subviews.detalleTarea = new DetalleTarea({
					el: $('#detalleTarea-content', this.el),
					model: task
				});
				this.subviews.detalleTarea.render();
			}

			//lecturas - readingRegister
			//li passem la Task pq ha de sortir el MeterSerialNubmer a la subvista
			if (!_.isNull(rrCol = this.options.taskGlobal.get('readingRegister')) && !rrCol.isEmpty()) {
				this.subviews.lecturaTarea = new LecturaTarea({
					el: $('#lecturaTarea-content', this.el),
					taskGlobal : this.taskGlobal,
					collection: rrCol
				});
				this.subviews.lecturaTarea.render();
			}

			//citas - meetings
			if (!_.isNull(mCol = this.options.taskGlobal.get('meetings')) && !mCol.isEmpty()) {
				this.subviews.citaTarea = new CitaTarea({
					el: $('#citaTarea-content', this.el),
					collection: mCol
				});
				this.subviews.citaTarea.render();
			}

			//deudas - task commercial
			if (!_.isNull(cCol=this.options.taskGlobal.get('commercials')) && !cCol.isEmpty()) {
				this.subviews.deudaTarea = new DeudaTarea({
					el: $('#deudaTarea-content', this.el),
					collection: cCol
				});
				this.subviews.deudaTarea.render();
			}

			//comentarios - comment
			if (!_.isNull(comCol = this.options.taskGlobal.get('comments')) && !comCol.isEmpty()) {
				this.subviews.comentarioTarea = new ComentarioTarea({
					el: $('#comentarioTarea-content', this.el),
					collection: comCol
				});
				this.subviews.comentarioTarea.render();
			}
		},

		events: {
			"vclick .collapsible-iscroll h4 a.ui-btn" : "collapsibleToogle"
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

		contestaAction: function (contestaPopup) {
			var task = this.taskGlobal.get('task');
			if (_.isNull(task))
				return;
			//Si es una tasca en ejecucion - sempe mostrem el popup
			if(task.get('status') === TASKSTATUS.PROGRESS){
				contestaPopup.openPopup(task.id, this.progress);
			}else if(task.get('status') === TASKSTATUS.NONEXECUTIVE){
				app.navigate('contestaNoEjecutada/'+task.id, true);
			}else if(task.get('status') === TASKSTATUS.EXECUTIVE){
				app.navigate('contestaEjecutada/'+task.id+'/'+TASKSTATUS.EXECUTIVE, true);
			}else{
				//si està pendiente fem que s'obri el popup igualment pq no s'ha guardat bé l'status.
				contestaPopup.openPopup(task.id, this.progress);
			}
		},
		iniciaAction: function(){
			var self = this,
				task = this.taskGlobal.get('task'),
				now = moment().format("YYYY-MM-DDTHH:mm:ss");
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			task.set({initialdatereal: now});
			this.taskGlobal.initTask({
				success: function (model) {
					console.log("saved: Task iniciada");
					self.taskGlobal.trigger("iniciaAction");
					self.renderInitialDateReal();
					$.mobile.loading('hide');
				},
				error: function () { console.log("error saving task iniciada");/* TODO ERROR SAVE DATA */ }
			});
		},
		askIniciaAction: function(confirmationPopup){
			//primer mirem si la task ja està iniciada -> popup de confirmació de tornar-la a iniciar
			var task = this.taskGlobal.get('task'),
				self= this;
			if (_.isNull(task))
				return;
			if(!_.isNull(task.get('initialdatereal'))){
				//popup confirm
				confirmationPopup.openPopup('dialog.iniciar', 'dialog.reiniciarTarea', function() {
					self.iniciaAction();
				});
			}else{
				this.iniciaAction();
			}
		},
		showFotosAction: function() {
			var task = this.taskGlobal.get('task'),
				self = this;
			if (_.isNull(task))
				return;

			app.navigate('fotos/' + task.id, true);
		},
		goToMap: function () {
			var task = this.taskGlobal.get('task'),
				self = this;
			if (_.isNull(task))
				return;

			openMap({ address: task.get('completeaddress')});
		}
	});
	return DetalleTareaView;

});