define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/top10.html', 'jqm'],
	function($, _, Backbone, stickit, Header, jqmPageTpl, top10Tpl) {

	var Top10 = Backbone.View.extend({

		initialize: function () {
			this.template = _.template(top10Tpl);
			this.top10Data = {
				rank: '1',
				name: '----',
				points: 99
			};
		},

		render: function () {
			this.updateTop10Data();
			$(this.el).html(this.template(this.top10Data)).i18n();
			return this;
		},

		updateTop10Data: function() {
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
				idPage: this.idPage,
				showMenuListBtn: false
			}).render();

			this.subviews.top10 = new Top10({
				el: $('#page-content', this.el),
				collection: this.options.taskCollections
			}).render();

			return this;
		}
	});
	return Top10Page;

});