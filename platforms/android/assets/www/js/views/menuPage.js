define(['jquery', 'underscore', 'backbone.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/menu.html', 'jqm'],
	function($, _, Backbone, Header, jqmPageTpl, menuTpl) {

	var Menu = Backbone.View.extend({

		initialize:function () {
			this.template = _.template(menuTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({versio: app_version})).i18n();
			this.fillCategoryData();
			return this;
		},
		
		fillCategoryData:function(){
			console.log("fillCategoryData");
			var options = $("#categoryid", this.el);
			this.collection.each( function (category) {
				//console.log(JSON.stringify(category, null, 4));
				options.append('<option value="'+category.id+'">'+category.get('name')+'</option>');
			});				
		}

	});

	var MenuPage = Backbone.View.extend({
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
				title: 'menu.title',
				idPage: this.idPage,
				showBackBtn: false,
				showUserInfo: false,
				menuBtns: this.initMenuHeaderBtns()
			}).render();

			this.subviews.menuView = new Menu({
				el: $('#page-content', this.el),
				collection: this.options.categoryCollections
			}).render();

			return this;
		},

		initMenuHeaderBtns: function () {
			var self = this,
				buttonsMenu = [];

			if (!isIOS()) {
				buttonsMenu.push({id: 'btn_salir', icon: 'signout', class:'', text: 'menuList.exit', url: 'exitApp' });
			}

			return buttonsMenu;
		},
		
		events: {
			"click #training_btn": "doTraining",
			"click #challenge_btn": "doChallenge",
			"click #statistics_btn": "doStatistics",
			"click #top10_btn": "doTop10"
		},
		
		doTraining: function() {
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			console.log('navigate question');
			app.navigate('question/'+$('#categoryid').val()+'/0', true);
		},
		
		doChallenge: function() {
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			console.log('navigate wait');
			this.doPush();
			app.navigate('wait', true);
		},
		
		doPush: function() {
			console.log('doPush');
			//var currentInstallation = Parse.Installation.current();
			var query = new Parse.Query(Parse.Installation);
			//query.notEqualTo('objectId', 'AtVUV8F8Hm');
			/*query.first({
				success: function(object){
					console.log('success');
				},
				error: function(error){
					console.log('error querying first installation');
				}
			});*/
			 
			Parse.Push.send({
			  where: query, // Set our Installation query
			  data: {
			    alert: "Hi again! would you like to Play Q&A with me?",
			    objectId: Parse.User.current().id
			  }
			}, {
			  success: function() {
			    // Push was successful
			  },
			  error: function(error) {
			    // Handle error
			  }
			});			
		},
		
		doStatistics: function() {
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			console.log('navigate statistics');
			app.navigate('statistics', true);
		},
		
		doTop10: function() {
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			console.log('navigate top10');
			app.navigate('top10', true);
		}		

	});

	return MenuPage;

});