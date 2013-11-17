define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit', 'utils', 'moment', 'views/headerView', 'views/dialogs/confirmationPopup', 'text!templates/jqmPage.html', 'text!templates/logs/logsList.html', 'text!templates/logs/logsItemList.html', 'text!templates/logs/emptyLogsList.html', 'jqm'],
	function($, _, Backbone, stickit, utils, moment, Header, ConfirmationPopup, jqmPageTpl, logsListTpl, logItemListTpl, emptyLogListTpl) {

	var EmptyListLogsView = Backbone.View.extend({
		initialize: function() {
			this.template= _.template(emptyLogListTpl);
		},
		render: function(eventName){
			$(this.el).html(this.template({title: this.options.title})).i18n();
			return this;
		}
	});
	var LogItemList = Backbone.View.extend({
		bindings:{
			'#Date' : {
				observe: 'Date',
				onGet: 'dateFormat'
			},
			'#Operation': {
				observe: ['Operation', 'Description'],
				onGet: 'infoError'
			},
			'#Nivel': 'Nivel'
		},
		infoError: function(values){
			return values[0]+':  '+values[1];
		},
		dateFormat: function(value){
			if (!_.isNull(value))
				return moment(value).format('DD/MM/YYYY HH:mm:ss');
			else
				return '-';
		},
		tagName: 'li',

		initialize: function() {
			this.template = _.template(logItemListTpl);
			//this.model.bind('remove', this.remove);
		},

		render: function (eventName) {
			$(this.el).html(this.template()).i18n();
			$(this.el).trigger('create');
			this.stickit();
			return this;
		}

	});


	var ListLogsView = Backbone.View.extend({

		initialize:function () {
			this.template = _.template(logsListTpl);
			this.collection.bind("add", this.renderLogs, this);
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();
			this.renderLogs();
			return this;
		},

		renderLogs: function () {
			$logList = $('#logsList', this.el);

			this.addLogsToList($logList, this.collection.models);
		},

		addLogsToList: function ($container, logs) {
			_.each(logs, function (log) {
				$container.append(new LogItemList({ model: log }).render().el);
			});
			try {
				$container.listview('refresh');
			} catch(e) {
				console.log(e.code + " " + e.message);
			}
		},
		deleteLogs: function(){
			this.collection.deleteLog({
				success:function(){
					//ok
					$.mobile.loading('hide');
				},
				error:function(error){
					/* error delete */
					execError(ERROR_DELETE_DATA+' Logs');
				}
			});
		}
	});

	var ListLogsPage = Backbone.View.extend({
		idPage: ID_PAGE.LOGS,
		subviews: {},
		logCollection: null,

		initialize:function () {
			this.template = _.template(jqmPageTpl);
			this.subviews.confirmationPopup = new ConfirmationPopup();
			this.logCollection = this.options.logCollections;
			this.logCollection.bind("reset", this.renderView, this);
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));
			this.renderPopups();
			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'logs.title',
				idPage: this.idPage,
				showBackBtn: true,
				menuBtns: this.initMenuHeaderBtns()
			}).render();

			if(!_.isEmpty(this.options.logCollections.models)){
				this.subviews.listLogsView = new ListLogsView({
					el: $('#page-content', this.el),
					collection: this.options.logCollections
				}).render();
			}else{
				this.subviews.emptylistLogsView = new EmptyListLogsView({
					el: $('#page-content', this.el),
					title: 'no-logs'
				}).render();
			}
			return this;
		},
		renderView: function() {
			if(!_.isEmpty(this.logCollection.models)){
				this.subviews.listLogsView = new ListLogsView({
					el: $('#page-content', this.el),
					collection: this.logCollection
				}).render();
			}else{
				this.subviews.emptylistLogsView = new EmptyListLogsView({
					el: $('#page-content', this.el),
					title: 'no-logs'
				}).render();
			}
			$('#page-content', this.el).trigger('create');
		},
		renderPopups: function () {
			this.$el.append(this.subviews.confirmationPopup.render().el);
		},

		initMenuHeaderBtns: function () {
			var self = this;
			return [
				{id: 'btn_borrar', icon: 'trash', text: 'menuList.borrarConfig', action: function(event){ self.deleteLogs(); }}
			];
		},
		deleteLogs: function(){
			var self= this;
			this.subviews.confirmationPopup.openPopup('dialog.delete', 'dialog.deleteLogText', function() {
                self.subviews.listLogsView.deleteLogs();

            });
		}

	});
return ListLogsPage;

});