define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/askClue.html', 'jqm'],
	function($, _, Backbone, stickit, Header, jqmPageTpl, askClueTpl) {

	var AskClue = Backbone.View.extend({

		initialize: function () {
			this.template = _.template(askClueTpl);
		},

		render: function () {
			$(this.el).html(this.template()).i18n();
			return this;
		},

	});

	var AskCluePage = Backbone.View.extend({
		idPage: ID_PAGE.ASK_CLUE,
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

			this.subviews.askClue = new AskClue({
				el: $('#page-content', this.el),
				collection: this.options.taskCollections
			}).render();

			return this;
		},

		events: {
			"click #ask_btn": "doAsk"
		},

		doAsk: function() {
			app.navigate('wait', true);
		}
		
	});
	return AskCluePage;

});