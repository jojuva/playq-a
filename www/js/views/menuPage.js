define(['jquery', 'underscore', 'backbone.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/menu.html', 'jqm'],
	function($, _, Backbone, Header, jqmPageTpl, menuTpl) {

	var Menu = Backbone.View.extend({

		initialize:function () {
			this.template = _.template(menuTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({versio: app_version})).i18n();
			return this;
		},

	});

	var MenuPage = Backbone.View.extend({
		idPage: ID_PAGE.MENU,
		subviews: {},

		initialize:function () {
			//var data = {};
			this.template = _.template(jqmPageTpl);
			//this.template = '';
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));

			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'menu.title',
				idPage: this.idPage,
				showBackBtn: true,
				showUserInfo: false,
				showMenuListBtn: false
			}).render();

			this.subviews.menuView = new Menu({
				el: $('#page-content', this.el)
			}).render();

			return this;
		},
		
		events: {
			"click #training_btn": "doTraining",
			"click #challenge_btn": "doChallenge",
			"click #statistics_btn": "doStatistics",
			"click #top10_btn": "doTop10"
		},

		doTraining: function() {
			console.log('navigate question');
			app.navigate('question/X0PMoUgy4C', true);
		},
		
		doChallenge: function() {
			console.log('navigate wait');
			app.navigate('wait', true);
		},
		
		doStatistics: function() {
			console.log('navigate statistics');
			app.navigate('statistics', true);
		},
		
		doTop10: function() {
			console.log('navigate top10');
			app.navigate('top10', true);
		}		

	});

	return MenuPage;

});