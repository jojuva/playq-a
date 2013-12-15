define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/top10List.html', 'text!templates/top10ItemList.html', 'jqm'],
	function($, _, Backbone, stickit, Header, jqmPageTpl, top10ListTpl, top10ItemListTpl) {

	var Top10ItemList = Backbone.View.extend({
		bindings:{
			'#rank' : {
				observe: 'position',
				onGet: 'rankFormat'
			},
			'#name': {
				observe: 'user',
				onGet: 'nameFormat'
			},
			'#points': {
				observe: 'score',
				onGet: 'scoreFormat'
			}
		},
		rankFormat: function(value){
			if (!_.isNull(value))
				return value;
			else
				return '-';
		},
		nameFormat: function(value){
			return value.get('username');
		},
		scoreFormat: function(value){
			if (!_.isNull(value))
				return value;
			else
				return '-';
		},
		tagName: 'tr',

		initialize: function() {
			this.template = _.template(top10ItemListTpl);
			//this.model.bind('remove', this.remove);
		},

		render: function (eventName) {
			$(this.el).html(this.template()).i18n();
			$(this.el).trigger('create');
			this.stickit();
			return this;
		}

	});


	var ListTop10View = Backbone.View.extend({
		//tagName: 'tbody',
		
		initialize:function () {
			this.template = _.template(top10ListTpl);
			this.collection.bind("add", this.renderTop10, this);
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();
			this.renderTop10();
			return this;
		},

		renderTop10: function () {
			$top10List = $('#top10List', this.el);

			this.addTop10ToList($top10List, this.collection.models);
		},

		addTop10ToList: function ($container, list) {
			_.each(list, function (item) {
				$container.append(new Top10ItemList({ model: item }).render().el);
			});
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

	var Top10Page = Backbone.View.extend({
		idPage: ID_PAGE.TOP10,
		subviews: {},

		initialize:function () {
			this.template = _.template(jqmPageTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));
			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'top10.title',
				idPage: this.idPage,
				showBackBtn: true,
				menuBtns: this.initMenuHeaderBtns()
			}).render();

			if(!_.isEmpty(this.options.rankingCollections.models)){
				this.subviews.listTop10View = new ListTop10View({
					el: $('#page-content', this.el),
					collection: this.options.rankingCollections
				}).render();
			}
			return this;
		},

		initMenuHeaderBtns: function () {
			var self = this;
			return [
				{id: 'btn_borrar', icon: 'trash', text: 'menuList.borrarConfig', action: function(event){ self.deleteLogs(); }}
			];
		},
		deleteLogs: function(){
			var self= this;
            self.subviews.listLogsView.deleteLogs();
		}

	});
	return Top10Page;

});