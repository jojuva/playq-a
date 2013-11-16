define(['jquery', 'underscore', 'backbone.extend', 'views/headerView', 'loginUtils', 'models/login/changepassword', 'sync/dto/userLoginDTO' , 'text!templates/jqmPage.html', 'text!templates/changePsw/changePsw.html', 'jqm'],
	function($, _, Backbone, Header, LoginUtils, ChangePassword, UserLogin, jqmPageTpl, changePswTpl) {

	var ChangePsw = Backbone.View.extend({

		bindings: {
			"#username" : "username",
			"#oldpassword" : "oldpassword",
			"#newpassword" : "newpassword",
			"#repeatnewpassword" : "repeatnewpassword"
		},


		initialize:function () {
			this.template = _.template(changePswTpl);
			this.model = new ChangePassword();
			this.model.on("validated:valid", this.changePassword, this);
			this.model.on("validated:invalid", this.invalidForm, this);
		},

		render:function (eventName) {
			$(this.el).html(this.template({versio: app_version})).i18n();
			this.stickit();
			return this;
		},

		events: {
			"click #submit_changepsw_btn": "validateForm",
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

		clearPasswords: function() {
			this.model.set({
				oldpassword: null,
				newpassword: null,
				repeatnewpassword: null
			});
		},

		validateForm: function () {
			$.mobile.loading('show', {text: $.t("loading.process"), textVisible: true, html: "", theme: "f"});
			this.scrollTop();
			this.model.validate();
		},

		invalidForm: function (model, errors) {
			$.mobile.loading('hide');
			this.showErrors(errors);
			if (!_.isUndefined(errors.newpassword) || !_.isUndefined(errors.repeatnewpassword)) {
				this.clearPasswords();
			}
		},

		changePassword: function () {
			var self = this,
				credentials = {
					username: this.model.get('username'),
					password: this.model.get('oldpassword'),
					newpassword: this.model.get('newpassword')
				};

			this.hideErrors();
			this.hideErrorMessage($('#errors-changepsw', this.el));

			new LoginUtils().changePassword(credentials, {
				success: function() {
					app.navigate('tareas', true);
				},
				error: function(error, message) {
					self.showErrorRecived(error, message);
				}
			});
		},

		showErrorRecived: function (error, message) {
			var errorMsg,
				$errorsContent = $('#errors-changepsw', this.el);

			scroll(0);
			
			if (error === ERROR.CHANGE_PSW_ERROR_GOT) {
				errorMsg = { error: { text: "error.got_error_code", parameter: message } };
			}
			else if (error === ERROR.CHANGE_PSW_ONLINE) {
				errorMsg = { text: "error.description." + ERROR.CHANGE_PSW_ONLINE.value };
			}
			else if (error === ERROR.ACCESS_DENIED) {
				errorMsg = { text: "error.login_error" };
			}
			else if (error === ERROR.LOGIN_OFFLINE_NO_CREDENTIALS) {
				errorMsg = { text: "error.fail_login_offline_no_credentials"};
			}

			if (!_.isUndefined(errorMsg)) {
				this.showErrorMessage($errorsContent, errorMsg);
			}

			this.clearPasswords();
			
			$.mobile.loading('hide');
		}
	});

	var ChangePswPage = Backbone.View.extend({
		idPage: ID_PAGE.CHANGE_PSW,
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
				showBackBtn: true,
				showUserInfo: false,
				showMenuListBtn: false
			}).render();

			this.subviews.changePswView = new ChangePsw({
				el: $('#page-content', this.el)
			}).render();

			return this;
		}
	});

	return ChangePswPage;

});