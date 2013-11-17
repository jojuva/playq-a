define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'mobiscroll', 'moment', 'models/internal/taskProgress', 'text!templates/contesta/progress/progressContent.html', 'text!templates/contesta/progress/progressForm.html', 'text!templates/contesta/progress/progressItemList.html', 'views/dialogs/confirmationPopup', 'jqm'],
	function($, _, Backbone, stickit, mobiscroll, moment, TaskProgress, progressContentTpl, progressFormTpl, progressItemListTpl, ConfirmationPopup) {
	
		var ProgressItemList = Backbone.View.extend({
		parent: null,
		tagName: 'li',

		bindings:{
			'#date-avance' : {
				observe: 'datetimedegreeprogress',
				onGet: 'dateFormat'
			},
			'#avance' : {
				observe: 'degreeprogress',
				onGet: 'progressPerCent'
			}
		},

		getObservations: function (value) {
			if (!_.isNull(value) && !_.isEmpty(value)) {
				return value;
			}
			else
				return '';
		},

		progressPerCent: function (value) {
			if (!_.isNull(value))
				return value+' %';
			else
				return '';
		},

		dateFormat: function (value) {
			if (!_.isNull(value) && !_.isEmpty(value))
				return moment(value, "YYYY-MM-DDTHH:mm:ss").format('DD/MM/YYYY HH:mm');
			else
				return '';
		},

		initialize: function() {
			this.template = _.template(progressItemListTpl);
			this.parent = this.options.parent;
		},

		render: function (eventName) {
			$(this.el).html(this.template({progresstaskid: this.model.cid})).i18n();
			$(this.el).trigger('create');
			this.stickit();
			return this;
		},
		events : {
			"click a[id^=delete-avance-]" : "removeProgress"
		},
		removeProgress: function (event) {
			$(event.currentTarget).trigger('btnClick');
			this.parent.removeProgress(this.model);
		}
	});

	var ProgressListView = Backbone.View.extend({
		progresstaskCollection: null,
		parent: null,

		initialize:function () {
			this.progresstaskCollection = this.options.progresstask;
			this.progresstaskCollection.bind("reset add remove", this.renderProgress, this);
			this.parent = this.options.parent;
		},

		render:function (eventName) {
			this.renderProgress();
			return this;
		},

		renderProgress: function () {
			$prList = $('#progress-list', this.el);
			$prList.find('li:gt(0)', this.el).remove();
			if (this.progresstaskCollection.size() === 0) {
				$prList.hide();
			}
			else {
				$prList.show();
				this.progresstaskCollection.each(function(avance) {
					view = new ProgressItemList({
						model: avance,
						parent: this
					});
					$prList.append(view.render().el);
				}, this);
				try {
					$prList.listview('refresh');
				} catch(e) {
					// no need refresh
				}
			}
		},

		removeProgress: function(model){
			this.parent.deleteProgress(model);
		}
	});

	var ProgressForm = Backbone.View.extend({
		progresstask: null,
		progressNew: null,
		taskid: null,
		bindings:{
			'#datetimedegreeprogress' : {
				observe: 'datetimedegreeprogress',
				onGet: 'getDate',
				onSet: 'setDate'
			},
			"#degreeprogress" : {
				observe: 'degreeprogress',
				onSet: 'progressInt'
			}
		},

		getDate: function(value) {
			if(!_.isNull(value)) {
				return moment(value, 'YYYY-MM-DDTHH:mm:ss').format("DD/MM/YYYY HH:mm");
			}
		},

		setDate: function(value){
			if(!_.isNull(value)){
				return moment(value, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm:ss");
			}else{
				return null;
			}
		},

		progressInt: function (value) {
			if (!_.isNull(value))
				return parseInt(value, 10);
			else
				return 0;
		},

		initialize:function () {
			this.template = _.template(progressFormTpl);
			this.progresstask = this.options.progresstask;
			this.taskid = this.options.task.get('taskid');
			this.progressNew = new TaskProgress({
				taskid: this.taskid,
				datetimedegreeprogress: moment().format('YYYY-MM-DDTHH:mm:ss')
			});
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();
			this.stickit(this.progressNew, this.bindings);
			return this;
		},

		events:{
			"click #crear_progress" : "addProgress",
			"focusout #datetimedegreeprogress" : "scrollAjust"
		},

		scrollAjust: function() {
			if (isIOS()) {
				$.mobile.silentScroll(window.pageYOffset);
			}
		},

		addProgress: function(event){
			event.preventDefault();
			event.stopPropagation();
			$(event.currentTarget).trigger('btnClick');

			if (_.isUndefined(this.progresstask) || _.isUndefined(this.progressNew)) {
				return;
			}
			var self = this,
				errorsVal = this.progressNew.validate();
			if (!_.isUndefined(errorsVal)) {
				this.showErrors(errorsVal);
			}
			else {
				this.hideErrors();
				this.unstickit(this.progressNew);
				//Si ja hi ha la data (se sobreescriu)
				var dateAux = moment(self.progressNew.get('datetimedegreeprogress')).format('YYYY-MM-DD');
				var existProgress = _.filter(this.progresstask.models, function(p){ return moment(p.get('datetimedegreeprogress')).format('YYYY-MM-DD') === dateAux; });
				if(existProgress.length > 0) {
					this.progresstask.get(existProgress[0].cid).set({
						degreeprogress: this.progressNew.get('degreeprogress'),
						datetimedegreeprogress: this.progressNew.get('datetimedegreeprogress')
					});
					this.progresstask.trigger('edit');
				} else {
					this.progresstask.add(this.progressNew.toJSON());
				}
				this.progressNew = new TaskProgress({
					taskid: this.taskid,
					datetimedegreeprogress: moment().format('YYYY-MM-DDTHH:mm:ss')
				});
				this.stickit(this.progressNew, this.bindings);
			}
		}
	});

	var ProgressContent = Backbone.View.extend({
		subviews: {},
		progresstask: null,

		initialize:function(){
			this.template = _.template(progressContentTpl);
			this.subviews.confirmationPopup = new ConfirmationPopup();
			this.progresstask = this.options.progresstask;
		},

		render:function (eventName) {
			$(this.el).html(this.template({edited: this.options.edited})).i18n();

			this.subviews.progressForm = new ProgressForm({
				el:$('#progress-form', this.el),
				progresstask: this.progresstask,
				task: this.options.task
			}).render();

			this.subviews.progressList = new ProgressListView({
				el: $('#content-progress-list', this.el),
				progresstask: this.progresstask,
				task: this.options.task,
				parent: this
			}).render();

			this.renderPopups();

			return this;
		},
		
		renderPopups: function (eventName) {
			this.$el.append(this.subviews.confirmationPopup.render().el);
		},

		deleteProgress: function(model) {
			var self = this;
			this.subviews.confirmationPopup.openPopup('dialog.delete', 'dialog.deleteProgress', function() {
				$.mobile.loading('hide');
				self.progresstask.remove(model);
            });
			
		}
	});

	return ProgressContent;
});