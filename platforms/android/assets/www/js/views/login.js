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
				window.localStorage.setItem(LS_NOM_OPERATOR, user.get("username"));
				window.localStorage.setItem(LS_QUESTION_IDS, "");
				window.localStorage.setItem(LS_LAST_LOGIN_DATETIME, moment().format("YYYYMMDDHHmmss"));
				window.localStorage.setItem(LS_STAY_LOGGED, $('#stay-logged').val());
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
	  
			//$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});

			this.hideErrors();
			this.hideErrorMessage($('#errors-login', this.el));
            
//			if (!isOnDevice()) {
//	            FB.login(
//	                    function(response) {
//	                    if (response.session) {
//	                    	alert('logged in');
//	                    	console.log(JSON.stringify(response));
//	                    } else {
//	                    	alert('not logged in');
//	                    	console.log(JSON.stringify(response));
//	                    	console.log(JSON.stringify(response.authResponse));
//	        	            Parse.FacebookUtils.logIn("user_likes,email", {
//
//	        	            	success: function(_user) {
//	        	            	    console.log("User is logged into Parse");
//	        	            	},
//
//	        	            	error: function(error1, error2){
//	        	            	    console.log("Unable to create/login to as Facebook user");
//	        	            	    console.log("  ERROR1 = "+JSON.stringify(error1));
//	        	            	    console.log("  ERROR2 = "+JSON.stringify(error2));
//	        	            	}
//	        	            	});
//	                    }
//	                    },
//	                    { scope: "email" }
//	                    );
//			}
//			
//			if (!isOnDevice()) {
//	            console.log('FB.getLoginStatus');
//	            FB.getLoginStatus(function(response) {
//	            	console.log('FB.getLoginStatus2');
//	                if (response.status == 'connected') {
//	                	//alert('status logged in');
//	                	console.log(JSON.stringify(localStorage.getItem('cdv_fb_session')));
//	                	console.log(JSON.stringify(response));
//	                	self.getUserInfo(response.authResponse); // Get User Information.
//	                } else {
//		                //alert('status not logged in');
//			            FB.login(
//			                    function(response) {
//			                    if (response.session) {
//			                    	//alert('logged in');
//			                    	console.log(JSON.stringify(response));
//			                    	self.getUserInfo(response.authResponse); // Get User Information.
//			                    } else {
//			                    	//alert('not logged in');
//			                    	console.log(JSON.stringify(response));
//			                    }
//			                    },
//			                    { scope: "email" }
//			                    );
//	                }
//	                });
//				
//			}
			
			// TODO: waiting Parse to resolve the issue with Phonegap
			// https://www.parse.com/questions/facebookutils-and-cordova-310
			//if (isOnDevice()) {
				Parse.FacebookUtils.logIn("user_likes,email",{
					  success: function(user) {
						if (!user.existed()) {
						  alert("User signed up and logged in through Facebook!");
						} else {
						  alert("User logged in through Facebook!");
						}
						window.localStorage.setItem(LS_NOM_OPERATOR, user.get("username"));
						window.localStorage.setItem(LS_QUESTION_IDS, "");
						window.localStorage.setItem(LS_LAST_LOGIN_DATETIME, moment().format("YYYYMMDDHHmmss"));
						window.localStorage.setItem(LS_STAY_LOGGED, $('#stay-logged').val());
						app.navigate('menu', true);	  
					  },
					  error: function(error1, error2){
	            	    console.log("Unable to create/login to as Facebook user");
	            	    console.log("  ERROR1 = "+JSON.stringify(error1));
	            	    console.log("  ERROR2 = "+JSON.stringify(error2));
					  }
					});		
			//}
		},
		
//		getUserInfo: function(authResponse){
//			console.log('getUserInfo');
//			FB.api('/me?access_token='+authResponse.accessToken, function(response) {
//				console.log(JSON.stringify(response));
//		        console.log(response.name);
//		        console.log(response.link);
//		        console.log(response.username);
//		        console.log(response.id);
//		        console.log(response.email);
//		        var query = new Parse.Query(Parse.User);
//		        query.equalTo("email", response.email);  
//		        query.equalTo("username", response.username);
//		        query.find({
//		          success: function(user) {
//		        	  if (user.length>0){
//		        		  console.log(JSON.stringify(user));
//		        		  user.become(Parse.User.current()._sessionToken);
//		        		  app.navigate('menu', true);
//		        	  }else{
//		  		          var newuser = new Parse.User();
//		        		  newuser.set("email", response.email);  
//		        		  newuser.set("username", response.username);
//		        		  newuser.set("password", response.username);
//		        		  newuser.signUp(null, {
//		        			  success: function(user) {
//		        				    // Hooray! Let them use the app now.
//		        				  	console.log(JSON.stringify(user));
//		        			        app.navigate('menu', true);
//		        				  },
//		        				  error: function(user, error) {
//		        				    // Show the error message somewhere and let the user try again.
//		        				    alert("Error: " + error.code + " " + error.message);
//		        				  }
//		        				});
//		        	  }
//		        		  
//		          }
//		        });
//		        });
//		},
		
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
				el: $('#page-content', this.el)
			}).render();

			return this;
		},

		initMenuHeaderBtns: function () {
			var self = this,
				buttonsMenu = [];

			//if (window.localStorage.getItem(LS_CHANGE_PASSWORD) === "true") {
				//buttonsMenu.push({id: 'btn_change_psw', icon: 'unlock-alt', class:'', text: 'menuList.changepsw', url: 'changepsw' });
			//}

			buttonsMenu.push({id: 'btn_cat', icon: 'chat', class:'', text: 'menuList.catala', url: 'idioma/ca' });
			buttonsMenu.push({id: 'btn_esp', icon: 'chat', class:'', text: 'menuList.castellano', url: 'idioma/es' });

			//if (!isIOS()) {
				//buttonsMenu.push({id: 'btn_salir', icon: 'signout', class:'', text: 'menuList.exit', url: 'exitApp' });
			//}

			return buttonsMenu;
		}

	});

	return LoginPage;

});