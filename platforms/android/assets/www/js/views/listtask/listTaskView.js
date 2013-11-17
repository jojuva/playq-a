define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit', 'utils','moment', 'syncGotMobile', 'views/dialogs/alertPopup', 'models/task', 'text!templates/listaTareas.html', 'text!templates/taskItemList.html', 'jqm'],
	function($, _, Backbone, stickit, utils, moment, SyncGotMobile, AlertPopup, Task, listaTareasTpl, taskItemListTpl) {

	var TaskItemList = Backbone.View.extend({

		bindings:{
			"#taskdescription" : {
				observe: "taskdescription",
				onGet: "getDescription"
			},
			"#gauge" : {
				observe: "gauge",
				onGet: "hideItemIfNull"
			},
			"#completeaddress": {
				observe: "completeaddress",
				onGet: "hideItemIfNull"
			},
			"#predicteddate": {
				observe: "predicteddate",
				onGet: "hideItemIfNullDate"
			},
			"#priority" : {
				observe : "priority",
				updateView: false,
				visible: "showIconpriority"
			},
			"#initialdatereal" : {
				observe: "initialdatereal",
				updateView : false,
				visible: "showIconIniciate"
			},
			'#ottypedesc' : {
				observe : "ottypedesc",
				onGet: "hideItemIfNull"
			}
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
		hideItemIfNull : function(value, options){
			if(_.isNull(value) || _.isUndefined(value)){
				$(this.el).find("#item-"+options.observe).hide();
			}else{
				return value;
			}
		},
		hideItemIfNullDate : function(value, options){
			if(_.isNull(value) || _.isUndefined(value)){
				$(this.el).find("#item-"+options.observe).hide();
			}else{
				return moment(value).format('DD/MM/YYYY');
			}
		},
		showIconpriority : function(value, options){
			return (value <= 2);
		},
		showIconIniciate : function(value, options){
			//Si hi ha data hem de tornar true / sino false
			return (!_.isNull(value));
		},

		tagName: 'li',
		parent: null,

		initialize: function() {
			this.template = _.template(taskItemListTpl);
			this.model.bind('remove', this.remove);
			this.parent = this.options.parent;
		},

		render: function (eventName) {
			$(this.el).html(this.template({task: this.model.toJSON() })).i18n();
			$(this.el).trigger('create');
			this.stickit();
			return this;
		},
		events:{
			"click a" : "linkDetalle"
		},

		linkDetalle:function(event){
			event.preventDefault();
			if ($(event.currentTarget).closest('li').hasClass('ui-btn-active'))
				return;

			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});

			var $linkElement = $(event.currentTarget);
			this.parent.clearSelectedTasks();
			$linkElement.closest('li').addClass('ui-btn-active');
			var id = '' + $linkElement.data("id");

			var self = this;
			setTimeout(function () {
				self.parent.showDetailTask(id);
			}, 200);
		}

	});


	var ListaTareasView = Backbone.View.extend({

		subviews: {},
		pendientes : null,
		contestadas : null,
		taskGlobal: null,

		initialize:function () {
			this.template = _.template(listaTareasTpl);
			this.collection.bind("reset", this.renderTareas, this);
			this.subviews.alertPopup = new AlertPopup();
			this.taskGlobal = this.options.taskGlobal;
			if (!_.isUndefined(this.taskGlobal)) {
				this.taskGlobal.bind('iniciaAction', this.refreshIniciaState, this);
			}
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();
			this.renderTareas();
			this.renderPopups();
			this.tabClick();

			return this;
		},

		renderPopups: function () {
			this.$el.append(this.subviews.alertPopup.render().el);
		},

		renderTareas: function () {
			this.pendientes = this.collection.filter(function (model){
				return model.get('tmstatus') !== TASKSTATUSSYNC.FINALIZADA;
			});
			this.contestadas = this.collection.filter(function (model) {
				return model.get('tmstatus') === TASKSTATUSSYNC.FINALIZADA;
			});

			$containerPendientes = $('#pendientes-list ul', this.el);
			$containerContestadas = $('#contestadas-list ul', this.el);

			$containerPendientes.empty();
			$containerContestadas.empty();

			this.addTasksToList($containerPendientes, this.pendientes);
			this.addTasksToList($containerContestadas, this.contestadas);
		},

		addTasksToList: function ($container, tasks) {
			_.each(tasks, function (task) {
				$container.append(new TaskItemList({ model: task, parent: this }).render().el);
			}, this);

			if (!_.isUndefined(this.taskGlobal) && !_.isNull(task = this.taskGlobal.get('task'))) {
				var taskId = task.id;
				var $elementTask = $container.find("a[data-id='" + taskId + "']");
				if (!_.isUndefined($elementTask)) {
					$elementTask.closest('li').addClass('ui-btn-active');
				}
			}

			try {
				$container.listview('refresh');
				$container.closest('div').iscrollview("refresh");
			} catch(e) {

			}
		},

		showDetailTask: function (idTask) {
			if (!_.isUndefined(this.taskGlobal)) {
				this.taskGlobal.set({task : new Task({taskid : idTask})}, {silent: true});
				this.taskGlobal.fetch({
					success: function() {$.mobile.loading('hide'); },
					error: function() {}
				});
			} else {
				$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
				app.navigate("tarea/"+idTask, true);
			}
		},

		emptyDetailView: function () {
			this.clearSelectedTasks();
			if(!_.isUndefined(this.taskGlobal)){
				this.taskGlobal.set(this.taskGlobal.defaults);
			}
		},

		clearSelectedTasks: function() {
			$('#pendientes-list ul li').removeClass('ui-btn-active');
			$('#contestadas-list ul li').removeClass('ui-btn-active');
		},

		events:{
			"click #navbar li" : "tabClick",
			"vclick #navbar li" : "tabClick"
		},

		tabClick: function (event) {
			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}

			var $element;
			if (!_.isUndefined(event)) {
				$element = $(event.currentTarget).find('a');
				this.emptyDetailView();
			} else {
				$element = $('#tabPendientes', this.el);
			}

			if (!_.isUndefined($element) && !_.isUndefined(tab = $element.attr('data-href'))) {
				$('#navbar a.ui-btn-active', this.el).removeClass('ui-btn-active');
				$element.addClass('ui-btn-active');

				if (tab === "pendientes") {
					$('#contestadas-list', this.el).hide();
					$('#pendientes-list', this.el).show();
				} else if (tab === "contestadas") {
					$('#pendientes-list', this.el).hide();
					$('#contestadas-list', this.el).show();
				}
			}
		},

		showSyncroErrors: function (errorType) {
			//error
			if (errorType === ERROR.SINCRO_OFFLINE) {
				this.subviews.alertPopup.openPopup('error.noSyncTitle', 'error.syncroOffline');
			} else {
				this.subviews.alertPopup.openPopup('error.noSyncTitle', 'error.syncroError');
			}
			$.mobile.loading('hide');
		},

		// Menu Header Button Sincro - action
		syncro: function (event) {
			var self = this,
				taskCollection = this.collection;

			$.mobile.loading('show', {text: $.t("loading.syncro"), textVisible: true, html: "", theme: "f"});

			new SyncGotMobile().syncroProcess({
				success: function () {
					self.emptyDetailView();
					if (!_.isUndefined(taskCollection)){
						taskCollection.fetch({
							success: function () {
								$.mobile.loading('hide');
							}
						});
					}
				},
				error: function (errorType) {
					self.showSyncroErrors(errorType);
				}
			});
		},

		emptyBD: function (){
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});

			new SyncGotMobile().emptyBDProcess({
				success: function () {
					$.mobile.loading('hide');
					app.navigate('login', true);
				},
				error: function () {
					//TODO log
					config.log("error eliminar dades");
					$.mobile.loading('hide');
				}
			});
		},

		refreshIniciaState: function () {
			if (!_.isUndefined(this.taskGlobal) && !_.isNull(task = this.taskGlobal.get('task'))) {
				var taskItem = this.collection.findWhere({taskid: task.id});
				if (!_.isUndefined(taskItem)) {
					taskItem.set({initialdatereal: task.get('initialdatereal')});
				}
			}
		}

	});
	return ListaTareasView;

});