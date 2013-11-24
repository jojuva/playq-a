define(['jquery', 'underscore', 'backbone.extend', 'backbone.stickit.extend', 'parse', 'models/loginUser', 'moment', 'views/headerView', 'views/dialogs/alertPopup', 'text!templates/jqmPage.html', 'text!templates/login.html', 'jqm'],
	function($, _, Backbone, stickit, Parse, LoginUser, moment, Header, AlertPopup, jqmPageTpl, loginTpl) {
	
	var Login = Backbone.View.extend({

		subviews: {},

		bindings: {
			"#username" : "username",
			"#password" : "password"
		},

		initialize:function () {
			this.template = _.template(loginTpl);
			this.model = new LoginUser();
			this.subviews.alertPopup = new AlertPopup();
			this.model.on("validated:valid", this.doLogin, this);
			this.model.on("validated:invalid", this.invalidForm, this);
		},

		render:function (eventName) {
			$(this.el).html(this.template({versio: app_version})).i18n();
			this.stickit();
			if (this.options.sessionExp === true) {
				this.showErrorRecived(ERROR.SESSION_EXPIRED);
			}
			this.renderPopups();
			return this;
		},

		renderPopups: function () {
			this.$el.append(this.subviews.alertPopup.render().el);
		},

		events: {
			"click #submit_login_btn": "validateForm",
			"click #face_login_btn": "doFBLogin",
			"focusout input.ui-input-text" : "scrollTop"
		},

		scrollTop: function () {
			if (isIOS()) {
				setTimeout(function() {
					if ($('#username', this.el).is(':focus') || $('#password', this.el).is(':focus'))
						return;
					$.mobile.silentScroll(0);
				}, 50);
			}
		},

		clearPassword: function() {
			this.model.set({ password: null });
		},

		validateForm: function (event) {
			this.scrollTop();
			console.log(this.model.get('username'));
			this.model.validate();
		},

		invalidForm: function (model, errors) {
			$.mobile.loading('hide');
			this.showErrors(errors);
			this.clearPassword();
		},

		doLogin:function () {
			var self = this;
		    var username = this.model.get('username');
		    var password = this.model.get('password');
	  
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});

			this.hideErrors();
			this.hideErrorMessage($('#errors-login', this.el));
			
			console.log("user:"+username);
			console.log("password:"+password);
			Parse.User.logIn(username, password, {
			  success: function(user) {
				// Do stuff after successful login.
				window.localStorage.setItem(LS_NOM_OPERATOR, user);
				app.navigate('menu', true);
			  },
			  error: function(user, error) {
				// The login failed. Check error to see why.
				console.log("login-error:"+error.message);
				self.showErrorReceived(user, error);
			  }
			});
		},
		
		doFBLogin:function () {
			var self = this;
	  
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});

			this.hideErrors();
			this.hideErrorMessage($('#errors-login', this.el));

			Parse.FacebookUtils.logIn(null, {
			  success: function(user) {
				if (!user.existed()) {
				  alert("User signed up and logged in through Facebook!");
				  window.localStorage.setItem(LS_NOM_OPERATOR, user);
				  app.navigate('menu', true);	  
				} else {
				  alert("User logged in through Facebook!");
				  window.localStorage.setItem(LS_NOM_OPERATOR, user);
				  app.navigate('menu', true);	  
				}
			  },
			  error: function(user, error) {
				console.log(user);
				console.log(error);
				self.showErrorReceived(user, error);
			  }
			});		
		},

		showErrorReceived: function (user, error) {
			var $errorsContent = $('#errors-login', this.el);

			scroll(0);

			if (!_.isUndefined(error)) {
				var errorMsg = { text: "error.login_error" };
				//var errorMsg = { text: error.message };
				this.showErrorMessage($errorsContent, errorMsg);
			}

			this.clearPassword();
			$.mobile.loading('hide');
		}
	});

	var LoginPage = Backbone.View.extend({
		idPage: ID_PAGE.LOGIN,
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
				title: 'login.title',
				idPage: this.idPage,
				showBackBtn: false,
				showUserInfo: false,
				menuBtns: this.initMenuHeaderBtns()
			}).render();

			this.subviews.loginView = new Login({
				el: $('#page-content', this.el),
				sessionExp: this.options.sessionExp
			}).render();

			return this;
		},

		initMenuHeaderBtns: function () {
			var self = this,
				buttonsMenu = [];

			if (window.localStorage.getItem(LS_CHANGE_PASSWORD) === "true") {
				buttonsMenu.push({id: 'btn_change_psw', icon: 'unlock-alt', class:'', text: 'menuList.changepsw', url: 'changepsw' });
			}

			buttonsMenu.push({id: 'btn_cat', icon: 'chat', class:'', text: 'menuList.catala', url: 'idioma/ca' });
			buttonsMenu.push({id: 'btn_esp', icon: 'chat', class:'', text: 'menuList.castellano', url: 'idioma/es' });

			if (!isIOS()) {
				buttonsMenu.push({id: 'btn_salir', icon: 'signout', class:'', text: 'menuList.exit', url: 'exitApp' });
			}

			return buttonsMenu;
		}

	});

	return LoginPage;

});