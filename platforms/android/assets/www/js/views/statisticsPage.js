define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/statistics.html', 'jqm'],
	function($, _, Backbone, stickit, Header, jqmPageTpl, statisticsTpl) {

	var Statistics = Backbone.View.extend({

		initialize: function () {
			console.log('ini-stats');
			this.template = _.template(statisticsTpl);
			this.statisticsData = {
				name: '----',
				points: 99,
				ok: 0,
				ko: 0,
				strike: 0,
				time: '----'
			};
		},

		render: function () {
			this.updateStatisticsData();
			$(this.el).html(this.template(this.statisticsData)).i18n();
			return this;
		},

		updateStatisticsData: function() {
			this.statisticsData.name = this.model.get('user').get('username');
			this.statisticsData.points = this.model.get('totScore');
			this.statisticsData.ok = this.model.get('okAnswers');
			this.statisticsData.ko = this.model.get('koAnswers');
			this.statisticsData.strike = this.model.get('maxStrike');
			var avgTime = this.model.get('avgTime')/this.model.get('okAnswers');
			this.statisticsData.time = avgTime.toString().substring(0,4)+' s';
		}
	});

	var StatisticsPage = Backbone.View.extend({
		idPage: ID_PAGE.STATISTICS,
		subviews: {},

		initialize:function () {
			console.log('ini-stats-page');
			this.template = _.template(jqmPageTpl);
		},

		render:function (eventName) {
			console.log('render-stats-page');
			$(this.el).html(this.template({headerFixed: true}));

			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'statistics.title',				
				idPage: this.idPage,
				showBackBtn: true,
				showUserInfo: false,
				showMenuListBtn: false
			}).render();

			this.subviews.statisticsView = new Statistics({
				el: $('#page-content', this.el),
				model: this.options.statistic
			}).render();

			return this;
		}
	});
	return StatisticsPage;

});