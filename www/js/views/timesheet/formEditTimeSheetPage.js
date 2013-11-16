define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend','utils', 'syncGotMobile', 'mobiscroll', 'collections/master/TimeSheetHourTypeCollections', 'collections/timesheet/TSProductiveCollections','views/headerView', 'views/dialogs/alertPopup', 'views/timesheet/editTabs/infoTSView','views/timesheet/editTabs/productiveView','views/timesheet/editTabs/noProductiveView', 'views/timesheet/editTabs/PLRView', 'views/timesheet/editTabs/dietView','views/timesheet/editTabs/observationView','views/timesheet/editTabs/resumeTS', 'views/dialogs/timesheet/endTSPopup', 'views/dialogs/timesheet/intervalsPopup', 'views/dialogs/timesheet/PLRPopup', 'text!templates/jqmPage.html', 'text!templates/timesheet/editTabs/editTabs.html', 'jqm'],
function($, _, Backbone, stickit, utils, SyncGotMobile, mobiscroll,TimeSheetHourTypeCollection, TSProductiveCollections, Header, AlertPopup, InfoView, ProductiveView, NoProductiveView, PLRView, DietView, ObservationView, ResumeView, EndTSPopup, EditIntervalsPopup, PLRPopup, jqmPageTpl, editTabsTpl) {
	var FormEditTabs = Backbone.View.extend({
		subviews: {},
		timeSheetGlobal: null,
		hoursNoProductive: null,
		hoursProductive: null,
		resourceProtection: null,
		listProductive: null,
		timeSheet: null,

		initialize:function () {
			this.template = _.template(editTabsTpl);
			this.timeSheetGlobal = this.options.timeSheetGlobal;
			this.listProductive = this.options.listProductive;
			
			var noproductive = this.options.timeSheetHourTypeCol.where({productive : "false"});
			var productive = this.options.timeSheetHourTypeCol.where({productive : "true"});
			this.hoursNoProductive = new TimeSheetHourTypeCollection(noproductive);
			this.hoursProductive = new TimeSheetHourTypeCollection(productive);

			this.resourceProtection = this.options.resourceCol;
			var resource = this.options.resourceCol.where({protectiontype : "true"});
			this.resourceProtection.reset(resource);

			this.timeSheet = this.options.timeSheet;
			this.timeSheet.set({status:TIMESHEETSTATUS.ABIERTO});
		},

		render:function (eventName) {
			this.renderTabs();
			this.renderPopupForms();
			return this;
		},

		renderTabs: function() {
			$(this.el).html(this.template()).i18n();
			this.subviews.infoTabView = new InfoView({
				el: $('#info-content', this.el),
				model: this.timeSheet,
				timeSheetWorkDateCol: this.options.timeSheetWorkDateCol
			});
			this.subviews.infoTabView.render();

			this.subviews.productiveTabView = new ProductiveView({
				el: $('#productive-content', this.el),
				model: this.timeSheetGlobal,
				productiveCol: this.listProductive,
				timeSheetHourProdTypeCol: this.hoursProductive,
				parent: this
			});
			this.subviews.productiveTabView.render();

			this.subviews.noProductiveTabView = new NoProductiveView({
				el: $('#noProductive-content', this.el),
				model: this.timeSheetGlobal,
				productiveCol: this.listProductive,
				timeSheetHourNoProdTypeCol: this.hoursNoProductive
			});
			this.subviews.noProductiveTabView.render();

			this.subviews.plrTabView = new PLRView({
				el: $('#plr-content', this.el),
				model: this.timeSheetGlobal,
				resourceProtectionCol: this.resourceProtection,
				parent: this
			});
			this.subviews.plrTabView.render();

			this.subviews.dietTabView = new DietView({
				el: $('#diet-content', this.el),
				model: this.timeSheet
			});
			this.subviews.dietTabView.render();

			this.subviews.observationTabView = new ObservationView({
				el: $('#observation-content', this.el),
				model: this.timeSheet
			});
			this.subviews.observationTabView.render();

			this.subviews.resumeTabView = new ResumeView({
				el: $('#resume-content', this.el),
				model: this.timeSheet,
				productiveCol: this.listProductive,
				tasks: this.timeSheetGlobal.get('tsTask'),
				noProductiveCol: this.timeSheetGlobal.get('tsNoProductive'),
				timeSheetHourProdTypeCol: this.hoursProductive,
				timeSheetHourNoProdTypeCol: this.hoursNoProductive
			});
			this.subviews.resumeTabView.render();
		},

		renderPopupForms: function() {
			var self = this;
			this.subviews.editIntervalsPopup = new EditIntervalsPopup({
				el: $('#intervals-popup', this.el),
				timeSheetHourTypeCol: this.hoursProductive,
				timesheet: this.timeSheetGlobal,
				productiveCol: this.listProductive,
				closeCallback: function() { self.showTabs(); }
			});
			this.subviews.editIntervalsPopup.render();

			this.subviews.plrPopup = new PLRPopup({
				el: $('#prl-popup', this.el),
				resourceProtectionCol : this.resourceProtection,
				closeCallback: function() { self.showTabs(); }
			});
			this.subviews.plrPopup.render();
		},

		openIntervalsPopup: function(model) {
			var self = this;
			this.hideTabs();
			this.subviews.editIntervalsPopup.openPopup(model);
		},

		openPLRPopup: function(model) {
			var self = this;
			this.hideTabs();
			this.subviews.plrPopup.openPopup(model);
		},

		hideTabs: function() {
			this.options.parent.subviews.headerView.$el.hide();
			$('#tabs', this.el).hide();
		},

		showTabs: function() {
			this.options.parent.subviews.headerView.$el.show();
			$('#tabs', this.el).show();
		},

		events: {
			"vclick .ui-collapsible h4 a.ui-btn" : "collapsibleToogle",
			"focusout .ui-input-text" : "scrollAjustInput"
		},

		collapsibleToogle: function(event) {
			event.preventDefault();
			event.stopPropagation();
			var $collapsible = $(event.currentTarget).closest('div');
			if ($collapsible.hasClass('ui-collapsible-collapsed')) {
				$collapsible.trigger('expand');
			} else {
				$collapsible.trigger('collapse');
			}
		},

		scrollAjustInput: function() {
			if (isIOS()) {
				setTimeout(function() {
					if ($('.ui-input-text', this.el).is(':focus'))
						return;
					$.mobile.silentScroll(window.pageYOffset);
				}, 50);
			}
		}
	});


	var FormEditTimeSheetPage = Backbone.View.extend({
		idPage: ID_PAGE.EDITPARTE,
		listProductive: null,
		timeSheetWorkTypeCol: null,
		subviews: {},

		initialize:function () {
			this.template = _.template(jqmPageTpl);
			this.listProductive = new TSProductiveCollections();
			this.fillListProductive(this.listProductive);
			this.subviews.endTSPopup = new EndTSPopup();
			this.subviews.alertPopup = new AlertPopup();
			this.timeSheetGlobal = this.options.timeSheetGlobal;
			this.timeSheetWorkTypeCol = this.options.TimeSheetWorkDateTypeCollections;
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));
			this.renderPopup();
			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'editparte.title',
				idPage: this.idPage,
				menuBtns: this.initMenuHeaderBtns(),
				headerExtraBtns: this.initHeaderExtraBtns(),
				showMenuListBtn: false,
				confirmBackBtn: true
			}).render();

			this.subviews.editTabsView = new FormEditTabs({
				el: $('#page-content', this.el),
				timeSheet: this.options.timeSheetGlobal.get('timeSheet'),
				timeSheetGlobal: this.options.timeSheetGlobal,
				timeSheetWorkDateCol: this.options.TimeSheetWorkDateTypeCollections,
				timeSheetHourTypeCol: this.options.TimeSheetHourTypeCollections,
				resourceCol: this.options.ResourceCollections,
				listProductive : this.listProductive,
				parent: this
			}).render();

			return this;
		},

		renderPopup: function () {
			this.$el.append(this.subviews.endTSPopup.render().el);
			this.$el.append(this.subviews.alertPopup.render().el);
		},

		initMenuHeaderBtns: function () {
			var self = this;
			return [];
		},

		initHeaderExtraBtns: function () {
			var self = this;
			return [
				{id: 'btn_guardar', icon: 'save', text: 'menuList.guardarTimeSheet', action: function (event) { self.save(); } }
			];
		},

		fillListProductive:function (list){
			_.each(this.options.timeSheetGlobal.get('tsTask').models, function(tstask){
				_.each(tstask.get('tsproductivetime').models, function(tsproductive){
					list.add(tsproductive.toJSON());
				}, this);
			}, this);
		},

		save: function () {
			var self = this;
			//primer comprovem solapaments
			this.timeSheetGlobal.comprovarOverlap(this.listProductive, {
				success: function (){
					min_work = self.timeSheetWorkTypeCol.get(self.timeSheetGlobal.get('timeSheet').get('workDateTypeForOUId'));
					self.timeSheetGlobal.checkFinalTS(self.listProductive, min_work, {
						success: function (missatge) {
							self.subviews.endTSPopup.openPopup('timesheet.endTS', missatge, function(state) {
								self._saveTS(state);
							});
						}
					});
				},
				error: function (miss_error){
					//Pintar per pantalla l'error
					self.showErrorMessage($('#errorTS', self.el), miss_error);
				}
			});

		},

		_saveTS: function(state){
			var self = this;

			this.timeSheetGlobal.get('timeSheet').set({status:state});
			this.timeSheetGlobal.save({
				success: function(model){
					//Enviem al sincro
					new SyncGotMobile().syncroUpParte(self.timeSheetGlobal, "SAVE", {
						success: function() {
							self._endSaveTS(state);
						},
						error: function() {
							self._endSaveTS(state);
						}
					});
				},
				error: function(errorType){
					$.mobile.loading('hide');
					if(errorType === ERROR.ERROR_SAVE_DATA){
						this.subviews.alertPopup.openPopup('error.saveDataTitle', 'error.saveDataError');
					}else{
						//error
						this.subviews.alertPopup.openPopup('error.saveDataTitle', 'error.genericError');
					}
				}
			});
		},

		_endSaveTS: function (state) {
			if (state === TIMESHEETSTATUS.ABIERTO) {
				$.mobile.loading('hide');
			} else {
				app.back();
			}
		}
	});

	return FormEditTimeSheetPage;
});