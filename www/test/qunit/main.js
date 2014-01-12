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
	parse: 'libs/parse/parse-1.2.15',
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
	'swipe': 'libs/swipe/swipe',
    jasmine: 'libs/jasmine/jasmine-1.3.1',
    'jasmine-html': 'libs/jasmine/jasmine-html',
    'jasmine-jquery': 'libs/jasmine/jasmine-jquery',
    sinon: 'libs/sinon/sinon-1.7.3',
    qunit: 'libs/qunit/qunit-1.13.0',
    'modelsTest': '../test/qunit/models/',
    'viewsTest': '../test/qunit/views/'
		
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
	},
    jasmine: {
        exports: 'jasmine'
    },
    'jasmine-html': {
    	deps: ['jasmine'],
    	exports: 'jasmine'
    },
    'jasmine-jquery': {
    	deps: ['jasmine'],
    	exports: 'jasmine'
    },
    qunit: {
        exports: 'QUnit'
    },
    sinon: {
        exports: "sinon"
    }
}
});

window.store = "TestStore"; // override local storage store name - for testing

require(['underscore', 'jquery', 'qunit', 'sinon', 'backbone.extend', 'i18n', 'parse', 'app-config'], 
		function(_, $, QUnit, sinon, Backbone, i18n){

	  // Initialize Parse
	  Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
	  $.i18n.init({ lng: "ca-ES" });
	  
	  var specs = [];
	  
	  specs.push('modelsTest/TodoSpec');
	  //specs.push('modelsTest/categoryTest');	  
	  //specs.push('modelsTest/questionTest');
	  //specs.push('modelsTest/userTest');
	  //specs.push('viewsTest/loginTest');
	  //specs.push('viewsTest/menuTest');
	  //specs.push('spec/helper');	 
	  //specs.push('spec/index');

	  	  	 
	  $(function(){
	    require(specs, function(){
	    	// nothing to do here
	    });
	  });
	 
	});