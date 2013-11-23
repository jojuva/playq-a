define(['jquery', 'underscore', 'backbone.extend', 'backbone.stickit.extend', 'parse', 'moment', 'views/headerView', 'views/dialogs/alertPopup', 'text!templates/jqmPage.html', 'text!templates/login.html', 'jqm'],
	function($, _, Backbone, stickit, Parse, moment, Header, AlertPopup, jqmPageTpl, loginTpl) {
	
	var Login = Backbone.View.extend({

		subviews: {},

		bindings: {
			"#username" : "sUsername",
			"#password" : "sPassword"
		},

		initialize:function () {
			this.template = _.template(loginTpl);
			this.model = new Parse.User();
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
			this.model.set({ sPassword: null });
		},

		validateForm: function (event) {
			this.scrollTop();
			console.log("1");
			this.model.validate();
			console.log("2");
			//TODO Temporal BORRAR
			//window.localStorage.setItem(LS_NOM_OPERATOR, "Maria García");
			//window.localStorage.setItem(LS_OPERATOR_ID, 661);
			//window.localStorage.setItem(LS_ALIASTM, "TM01013");
			//window.localStorage.setItem(LS_LAST_LOGIN_DATETIME, moment().format("YYYYMMDD HH:mm:ss"));
			//window.localStorage.setItem(LS_EDIT_INIT_DATE, true);
			//window.localStorage.setItem(LS_EDIT_FINAL_DATE, true);
			//window.localStorage.setItem(LS_CHANGE_PASSWORD, true);
			//app.navigate('menu', true);
		},

		invalidForm: function (model, errors) {
			$.mobile.loading('hide');
			this.showErrors(errors);
			this.clearPassword();
		},

		doLogin:function () {
			var self = this,
				credentials = {
					username: this.model.get('sUsername'),
					password: this.model.get('sPassword')
				};

			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});

			this.hideErrors();
			this.hideErrorMessage($('#errors-login', this.el));

			Parse.User.logIn(username, password, {
			  success: function(user) {
				// Do stuff after successful login.
				window.localStorage.setItem(LS_NOM_OPERATOR, user);
				app.navigate('menu', true);
			  },
			  error: function(user, error) {
				// The login failed. Check error to see why.
				self.showErrorReceived(user, error);
			  }
			});
		},

		showErrorReceived: function (user, error) {
			var $errorsContent = $('#errors-login', this.el);

			scroll(0);

			if (!_.isUndefined(error)) {
				this.showErrorMessage($errorsContent, error);
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