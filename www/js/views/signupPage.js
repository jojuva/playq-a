define(['jquery', 'underscore', 'backbone.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/signUp.html', 'jqm'],
	function($, _, Backbone, Header, jqmPageTpl, signupTpl) {

	var SignUp = Backbone.View.extend({

		initialize:function () {
			this.template = _.template(signupTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({versio: app_version})).i18n();
			//this.stickit();
			return this;
		},

	});

	var SignUpPage = Backbone.View.extend({
		idPage: ID_PAGE.SIGN_UP,
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
				title: 'signup.title',
				idPage: this.idPage,
				showBackBtn: true,
				showUserInfo: false,
				showMenuListBtn: false
			}).render();

			this.subviews.menuView = new SignUp({
				el: $('#page-content', this.el)
			}).render();

			return this;
		},
		
		events: {
			"click #signup_btn": "doSignUp"
		},

		doSignUp: function() {
			app.navigate('menu', true);
		}

	});

	return SignUpPage;

});