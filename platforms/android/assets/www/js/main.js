require.config({
  baseUrl: "./js/",
  paths: {
	text: 'libs/require/text',
	jquery: 'libs/jquery/jquery-2.0.3',
	jqm:'libs/jquery/jquery.mobile-1.3.2',
	'jqm-config': 'jqm-config',
	'app-config': 'app-config',
	underscore: 'libs/underscore/underscore-1.5.2.min',
	'underscore.extend' : 'libs/underscore/underscore.playqa.extends',
	parse: 'libs/parse/parse-1.2.13',
	'facebook': 'libs/facebook/facebook-js-sdk',
	'fb-connect': 'libs/facebook/cdv-plugin-fb-connect',
	backbone: 'libs/backbone/backbone-1.0.0',
	'backbone.stickit': 'libs/backbone/backbone.stickit',
	'backbone.stickit.extend': 'libs/backbone/backbone.stickit.extends',
	'backbone.extend': 'libs/backbone/backbone.playqa.extends',
	'backbone.sync': 'libs/backbone/backbone.playqa.sync',
	'backbone.validation' : 'libs/backbone/backbone-validation',
	'json2': 'libs/json/json2',
	'i18n': 'libs/i18n/i18next.amd.withJQuery-1.7.1',
	templates: '../templates',
	views: 'views',
	collections: 'collections',
	'utils': 'utils',
	'moment': 'libs/moment/moment-with-langs.min',
	'mobiscrollcore' : 'libs/mobiscroll/mobiscroll.core',
	'mobiscrolldatetime' : 'libs/mobiscroll/mobiscroll.datetime',
	'mobiscroll-es' : 'libs/mobiscroll/i18n/mobiscroll.i18n.es',
	'mobiscroll-ca' : 'libs/mobiscroll/i18n/mobiscroll.i18n.ca',
	'mobiscroll' : 'libs/mobiscroll/mobiscroll.android-ics',
	'md5' : 'libs/hash/md5',
	'main' : 'main',
	'router' : 'router',
	'swipe': 'libs/swipe/swipe'
},
  shim: {
    underscore: {
		exports: "_"
    },
    'underscore.extend': {
		deps: ['underscore'],
		exports: "_"
    },
    parse: {
		exports: 'Parse'
    },    
	'facebook': {
		exports: 'FB'
    },	
    'fb-connect': {
		exports: 'CDV'
    },
    backbone: {
		deps: ['underscore.extend', 'jquery'],
		exports: 'Backbone'
    },
    'backbone.stickit': {
		deps: ['backbone'],
		exports: 'BackboneStickit'
    },
    'backbone.stickit.extend' : {
		deps: ['backbone.stickit'],
		exports: 'stickit'
    },
    'backbone.validation' : {
		deps: ['backbone'],
		exports: 'BackboneValidation'
    },
    'backbone.sync': {
		deps: ['backbone'],
		exports: 'BackboneSync'
    },
    'backbone.extend': {
		deps: ['backbone', 'backbone.validation', 'backbone.sync'],
		exports: 'Backbone'
    },
    'jqm-config': {
		deps:['jquery']
    },
    jqm:{
		deps:['jquery', 'jqm-config']
    },
    'i18n': {
		deps:['jquery', 'jqm-config']
	},
    'app-config': {
		exports: 'AppConf'
	},
	'utils':{
		deps:['jquery']
	},
	'router':{
		deps:['backbone.extend', 'utils']
	},
	'mobiscrollcore' : {
		deps: ['jquery', 'jqm-config']
	},
	'mobiscrolldatetime': {
		deps: ['mobiscrollcore']
	},
	'mobiscroll-es': {
		deps: ['mobiscrollcore']
	},
	'mobiscroll-ca': {
		deps: ['mobiscrollcore']
	},
	'mobiscroll':{
		deps: ['mobiscrolldatetime', 'mobiscroll-es', 'mobiscroll-ca']
	}
}
});
define(['require', "jquery", "underscore.extend", "parse", "facebook", "fb-connect", "jqm", "utils", "app-config", "json2"],
	function(require, $, _, Parse, FB, CDV) {
		// TODO Temporal borrar entrega
		if (!isOnDevice()) {
			console.log('NOT IS ON DEVICE');
			$(document).ready(function() {
				window.device = { uuid: '111111111', version: 'browser Chrome' };
                window.localStorage.setItem(LS_UUID, window.device.uuid);
				initApplication();
			});
		} else {
			console.log('YES IS ON DEVICE');
			//$(document).on("mobileinit", function () {
			$(document).ready(function() {
				document.addEventListener('deviceready', onDeviceReady, false);
			});
		}

		function onDeviceReady() {
			console.log('ONDEVICEREADY');
			document.addEventListener("backbutton", handleBackButton, false);
			document.addEventListener("menubutton", handleMenuButton, false);
			window.addEventListener("orientationchange", orientationHandler, false);
			initApplication();
		}
});
function initApplication() {
		// i18n init
	require(["jquery", "underscore.extend", "backbone.extend", "i18n", "router"],
		function($, _, Backbone, i18n, AppRouter){
		
		console.log('INITAPPLICATION');
		// Initialize Parse
		Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
		
		/*var TestObject = Parse.Object.extend("TestObject");
		var testObject = new TestObject();
		  testObject.save({foo: "bar"}, {
		  success: function(object) {
			$(".success").show();
		  },
		  error: function(model, error) {
			$(".error").show();
		  }
		});*/	

		// Initialize Facebook
		Parse.FacebookUtils.init({
		  appId      : FB_APP_ID, // Facebook App ID
          nativeInterface: CDV.FB,
          useCachedDialogs: false,
          status:true, // check login status
          cookie:true, // enable cookies to allow Parse to access the session
          xfbml:true, // parse XFBML
          oauth:true
		});
	   
	   // Initialize lang
		var lang = window.localStorage.getItem(LS_LANG);
		if (_.isNull(lang)) {
			window.localStorage.setItem(LS_LANG, DEFAULT_LANG);
		}

		// Initialize i18n
		i18n.init({
			lng: window.localStorage.getItem(LS_LANG),
			ns: { namespaces: ['ns.literals'], defaultNs: 'ns.literals'},
			sendMissing: true
			}, function() {
				setInitPluginLanguage();

				$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});

				app = new AppRouter();
				//mirem si és la primera vegada -> bd estarà buida i la variable de localstorage sera null
				// TODO temporal
				var empty = window.localStorage.getItem(LS_EMPTY_BD);
				if (_.isNull(empty)) {
					window.localStorage.setItem(LS_EMPTY_BD, "1");
				}
				Backbone.history.start();
				if (navigator.splashscreen) {
					navigator.splashscreen.hide();
				}
				$.mobile.loading('hide');
			}
		);
	});
}