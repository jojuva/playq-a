define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/statistics.html', 'jqm'],
	function($, _, Backbone, stickit, Header, jqmPageTpl, statisticsTpl) {

	var Statistics = Backbone.View.extend({

		initialize: function () {
			console.log('ini-stats');
			this.template = _.template(statisticsTpl);
			this.statisticsData = {
				name: '----',
				points: 99,
				time: '----',
				strike: 0,
				ok: 0,
				ko: 0
			};
		},

		render: function () {
			this.updateStatisticsData();
			$(this.el).html(this.template(this.statisticsData)).i18n();
			return this;
		},

		updateStatisticsData: function() {
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