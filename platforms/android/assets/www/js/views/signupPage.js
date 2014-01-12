define(['jquery', 'underscore', 'backbone.extend', 'backbone.stickit.extend', 'parse', 'models/playUser', 'models/ranking', 'models/statistic', 'views/headerView', 'views/dialogs/alertPopup', 'text!templates/jqmPage.html', 'text!templates/signUp.html', 'jqm'],
	function($, _, Backbone, stickit, Parse, PlayUser, Ranking, Statistic, Header, AlertPopup, jqmPageTpl, signupTpl) {

	var SignUp = Backbone.View.extend({
		parseFile: null,
		
		subviews: {},
		
		bindings: {
			"#username" : "username",
			"#email" : "email",
			"#password" : "password",
			"#repeatpassword" : "repeatpassword"
		},

		initialize:function () {
			this.template = _.template(signupTpl);
			this.model = new PlayUser();
			this.subviews.alertPopup = new AlertPopup();
			this.model.on("validated:valid", this.doSignUp, this);
			this.model.on("validated:invalid", this.invalidForm, this);			
		},

		render:function (eventName) {
			$(this.el).html(this.template({versio: app_version})).i18n();
			this.stickit();
			return this;
		},

		renderPopups: function () {
			this.$el.append(this.subviews.alertPopup.render().el);
		},
		
		events: {
			"click #signup_btn": "validateForm",
			"click #photo_btn": "doPhoto"
		},

		doPhoto: function(){
			var destinationType=navigator.camera.DestinationType;
			var pictureSource=navigator.camera.PictureSourceType;
			navigator.camera.getPicture(this.savePhoto, this.errorPhoto, { quality: 50,
			    destinationType: destinationType.DATA_URL,
			    sourceType: pictureSource.SAVEDPHOTOALBUM
			});
		},
		
		savePhoto: function (imageData) {
		    var image = document.getElementById('profileImg');
		    image.src = "data:image/jpeg;base64," + imageData;
		    window.localStorage.setItem(LS_PHOTO, imageData);
		},

		errorPhoto: function (message) {
		    alert('Failed because: ' + message);
		},
		
		scrollTop: function () {
			if (isIOS()) {
				$.mobile.silentScroll(0);
			}
		},

		clearPassword: function() {
			this.model.set({ password: null });
			this.model.set({ repeatpassword: null });
		},

		validateForm: function (event) {
			this.scrollTop();
			this.model.validate();
		},

		invalidForm: function (model, errors) {
			$.mobile.loading('hide');
			console.log(errors);
			this.showErrors(errors);
			this.clearPassword();
		},
		
		doSignUp:function () {
			var self = this;

			var user = new Parse.User();
			user.set("username", this.model.get('username'));
			user.set("password", this.model.get('password'));
			user.set("email", this.model.get('email'));	
			var imageData = window.localStorage.getItem(LS_PHOTO);
		    this.parseFile = new Parse.File('mobile.jpg', { base64: imageData });
			user.set("image", this.parseFile);	
			
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});

			this.hideErrors();
			this.hideErrorMessage($('#errors-signup', this.el));
			
			console.log("user:"+username);
			console.log("password:"+password);
			user.signUp(null, {
			  success: function(user) {
				console.log('New user created with objectId: ' + user.id);
				self.addRanking(user);
				self.addStatistic(user);
				window.localStorage.setItem(LS_NOM_OPERATOR, user.get("username"));
				window.localStorage.setItem(LS_QUESTION_IDS, "");
				window.localStorage.setItem(LS_LAST_LOGIN_DATETIME, moment().format("YYYYMMDDHHmmss"));
				app.navigate('menu', true);	
			  },
			  error: function(user, error) {
				//alert("Error: " + error.code + " " + error.message);
				console.log("login-error:"+error.message);
				self.showErrorReceived(user, error);	
			  }
			});			
		},

		addRanking: function (user) {
			var rank = new Ranking();
			rank.set('user',user);
			rank.save(null, {
			  success: function(object) {
				console.log('New ranking created with objectId: ' + object.id);
			  },
			  error: function(object, error) {
				console.log('Failed to create new ranking, with error code: ' + error.code);
			  }
			});
		},	
		
		addStatistic: function (user) {
			var stat = new Statistic();
			stat.set('user',user);
			stat.save(null, {
			  success: function(object) {
				console.log('New statistic created with objectId: ' + object.id);
			  },
			  error: function(object, error) {
				console.log('Failed to create new statistic, with error code: ' + error.code);
			  }
			});
		},				
		
		showErrorReceived: function (user, error) {
			var $errorsContent = $('#errors-signup', this.el);

			scroll(0);

			if (!_.isUndefined(error)) {
				var errorMsg = { text: "error.signup_error" };
				//var errorMsg = { text: error.message };
				this.showErrorMessage($errorsContent, errorMsg);
			}

			this.clearPassword();
			$.mobile.loading('hide');
		}		
	});

	var SignUpPage = Backbone.View.extend({
		idPage: ID_PAGE.SIGN_UP,
		subviews: {},

		initialize:function () {
			this.template = _.template(jqmPageTpl);
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
		}

	});

	return SignUpPage;

});