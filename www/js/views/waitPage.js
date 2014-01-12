define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/wait.html', 'jqm'],
	function($, _, Backbone, stickit, Header, jqmPageTpl, waitTpl) {

	var Wait = Backbone.View.extend({

		initialize: function () {
			this.template = _.template(waitTpl);
			this.waitData = {
				you: 'You',
				youpoints: 99,
				opp: 'Opponent',
				opppoints: 99
			};
		},

		render: function () {
			this.updateWaitData();
			$(this.el).html(this.template(this.waitData)).i18n();
			return this;
		},

		updateWaitData: function() {
		}
	});

	var WaitPage = Backbone.View.extend({
		idPage: ID_PAGE.WAIT,
		subviews: {},

		initialize:function () {
			this.template = _.template(jqmPageTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));

			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'wait.title',
				idPage: this.idPage,
				showBackBtn: true,
				showUserInfo: false,
				showMenuListBtn: false
			}).render();

			this.subviews.wait = new Wait({
				el: $('#page-content', this.el),
				collection: this.options.taskCollections
			}).render();

			return this;
		}
	});
	return WaitPage;

});