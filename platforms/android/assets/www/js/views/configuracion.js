define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend','utils', 'views/headerView','text!templates/jqmPage.html', 'text!templates/configuracion.html', 'jqm'],
	function($, _, Backbone, stickit, utils, Header, jqmPageTpl, configuracionTpl) {

	var Configuracion = Backbone.View.extend({
			bindings:{
				'#UID' : 'UID',
				/*'#idTM' : 'idTM',*/
				'#wsSync' : 'wsSync',
				'#imagesPath' : 'imagesPath',
				'#timeIntervalSync' : 'timeIntervalSync',
				"#logActive" : 'logActive'
			},
			initialize:function () {
				this.template = _.template(configuracionTpl);
				this.model.on("validated:invalid", function (model, errors) {
					this.showErrors(errors);
				}, this);
				this.model.on("validated:valid", function() { this.hideErrors(); }, this);
			},

			render:function (eventName) {
				$(this.el).html(this.template({})).i18n();
				this.stickit();
				return this;
			},

			events: {
				"focusout input.ui-input-text" : "scrollTop"
			},

			scrollTop: function () {
				if (isIOS()) {
					$.mobile.silentScroll(0);
				}
			},

			save: function () {
				$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
				this.model.save({}, {
					success: function (model) {
						console.log("saved: ConfigurationTM");
						$.mobile.loading('hide');
					},
					error: function () { /* TODO ERROR SAVE DATA */ },
					validate: true
				});
			},
			deleteConfig: function(){
				//el delete només es fer unset dels camps: WS sincro 
				this.model.unset('wsSync');
				//this.save(); //llavors fa la validació el save!
			}
		});

	var ConfiguracionPage = Backbone.View.extend({
		idPage: ID_PAGE.CONFIG,
		subviews: {},

		initialize:function () {
			this.template = _.template(jqmPageTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));

			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'config.title',
				idPage: this.idPage,
				menuBtns: this.initMenuHeaderBtns(),
				headerExtraBtns: this.initHeaderExtraBtns()
			}).render();

			this.subviews.configuracionView = new Configuracion({
				el: $('#page-content', this.el),
				model: this.options.configTM
			}).render();

			return this;
		},
		initMenuHeaderBtns: function () {
			var self = this;
			return [
				{id: 'btn_log', icon: 'file-alt', text: 'menuList.verLog', url: 'logs'},
				{id: 'btn_borrar', icon: 'trash', text: 'menuList.borrarConfig', action: function(event) { self.deleteConfig(); } }
			];
		},

		initHeaderExtraBtns: function () {
			var self = this;
			return [
				{id: 'btn_guardar', icon: 'save', text: 'menuList.guardarConfig', action: function (event) { self.save(); } }
			];
		},

		save: function () {
			this.subviews.configuracionView.save();
		},
		deleteConfig: function() {
			this.subviews.configuracionView.deleteConfig();
		}

	});

	return ConfiguracionPage;

});