define(['jquery', 'underscore', 'backbone.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/end.html', 'jqm'],
	function($, _, Backbone, Header, jqmPageTpl, endTpl) {

	var End = Backbone.View.extend({

		initialize:function () {
			this.template = _.template(endTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({versio: app_version})).i18n();
			console.log('RESULT:'+this.options.result)
			if (this.options.result == CODE_ERROR.OK){
				$('#winner', this.el).show();
			}else{
				$('#loser', this.el).show();
			}
			var profilePhoto = Parse.User.current().get("image");
			if (!_.isUndefined(profilePhoto)) {
				$("#profileImg", this.el).attr( "src", profilePhoto.url());
			}
			return this;
		},

	});

	var EndPage = Backbone.View.extend({
		idPage: ID_PAGE.MENU,
		subviews: {},

		initialize:function () {
			//var data = {};
			this.template = _.template(jqmPageTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));

			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'end.title',
				idPage: this.idPage,
				showBackBtn: false,
				showUserInfo: false,
				showMenuListBtn: false
			}).render();

			this.subviews.endView = new End({
				el: $('#page-content', this.el),
				result: this.options.result
			}).render();

			return this;
		},
		
		events: {
			"click #menu_btn": "doMenu"
		},
		
		doMenu: function() {
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			console.log('doMenu');
			app.navigate('menu', true);
		}
		
	});

	return EndPage;

});