define(['jquery', 'underscore.extend', 'backbone.extend', 'syncGotMobile', 'views/headerView', 'views/dialogs/confirmationPopup', 'views/dialogs/alertPopup', 'views/timesheet/listTimeSheetView', 'text!templates/jqmPage.html', 'jqm'],
	function($, _, Backbone, SyncGotMobile, Header, ConfirmationPopup, AlertPopup, ListTimeSheetView, jqmPageTpl) {

	var ListTimeSheetPage = Backbone.View.extend({
		idPage: ID_PAGE.PARTES,
		subviews: {},

		initialize:function () {
			this.template = _.template(jqmPageTpl);
			this.subviews.confirmationPopup = new ConfirmationPopup();
			this.subviews.alertPopup = new AlertPopup();
		},

		renderPopups: function () {
			this.$el.append(this.subviews.confirmationPopup.render().el);
			this.$el.append(this.subviews.alertPopup.render().el);
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));
			this.renderPopups();
			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'tareas.title',
				idPage: this.idPage,
				menuBtns: this.initMenuHeaderBtns(),
				headerExtraBtns: this.initHeaderExtraBtns()
			}).render();

			this.subviews.listTimeSheetView = new ListTimeSheetView({
				el: $('#page-content', this.el),
				collection: this.options.timeSheetCollections,
				parent: this
			}).render();
			return this;
		},

		initMenuHeaderBtns: function () {
			var self = this;

				return [
					{id: 'btn_sync_ts', icon: 'external-link', text: 'menuList.sync_ts',  action: function (event) { self.syncro(); } }
				];
		},

		initHeaderExtraBtns: function () {
			var self = this;
			return [
				{id:'btn_createTimSheet', icon: 'plus-sign', text: 'menuList.newTS', url: 'createTS'}
			];
		},

		showErrorsPopup: function (errorType) {
			//error
			if (errorType === ERROR.ERROR_DELETE_DATA) {
				this.subviews.alertPopup.openPopup('error.deleteDataTitle', 'error.deleteData');
			} else if (errorType === ERROR.ERROR_FETCH_DATA) {
				this.subviews.alertPopup.openPopup('error.deleteDataTitle', 'error.deleteData');
			} else if (errorType === ERROR.SINCRO_OFFLINE) {
				this.subviews.alertPopup.openPopup('error.noSyncTitle', 'error.syncroOffline');
			} else {
				this.subviews.alertPopup.openPopup('error.noSyncTitle', 'error.syncroError');
			}
			$.mobile.loading('hide');
		},

		syncro: function () {
			var self = this,
				tscollection = this.options.timeSheetCollections;
			$.mobile.loading('show', {text: $.t("loading.syncro"), textVisible: true, html: "", theme: "f"});
	
			new SyncGotMobile().syncroUpPartesCollection(
				{
					success: function() {
						if (!_.isUndefined(tscollection)){
							tscollection.fetch({
								success: function () {
									tscollection.trigger('repintar');
									$.mobile.loading('hide');
								}
							});
						}
					},
					error: function(errorType) {
						self.showErrorsPopup(errorType);
					}
				});
		}

	});
	return ListTimeSheetPage;
});