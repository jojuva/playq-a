define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend','utils', 'mobiscroll', 'moment', 'syncGotMobile', "sync/dto/partesUpDTO", 'views/headerView','text!templates/jqmPage.html', 'text!templates/timesheet/formCreateTimeSheet.html', 'jqm'],
	function($, _, Backbone, stickit, utils, mobiscroll, moment, SyncGotMobile, PartesUp, Header, jqmPageTpl, formCreateTimeSheetTpl) {
	var FormCreateTSView = Backbone.View.extend({
			timeSheetCol:null,
			bindings:{
				"#userid": {
					observe: "technicalOperatorId",
					onGet: 'getUserName'
				},
				"#timesheetworkdatetypeid" : {
					observe: "workDateTypeForOUId",
					selectOptions: {
						collection: 'this.options.timeSheetWorkDateType',
						labelPath: 'description',
						valuePath: 'id',
						defaultOption: {
							label: $.t("select.defaultLabel"),
							value: null
						}
					}
				},
				"#timesheetdate": {
					observe: 'date',
					onGet: "dateFormat",
					onSet: "setDateFormat"
				},
				"#plate": "vehicleRegistration"
			},
			dateFormat: function(value){
				if (!_.isNull(value) && !_.isEmpty(value))
					return value;
				else
					return '';
			},
			setDateFormat: function(value) {
				if(!_.isNull(value)){
					return moment(value, 'DD/MM/YYYY').format('YYYYMMDD');
				}else{
					return '';
				}
			},
			getUserName: function(value){
				return window.localStorage.getItem(LS_NOM_OPERATOR);
			},

			initialize:function () {
				this.template = _.template(formCreateTimeSheetTpl);
				this.model.on("validated:invalid", function (model, errors) {
					this.showErrors(errors);
				}, this);
				this.model.set({technicalOperatorId: parseInt(window.localStorage.getItem(LS_OPERATOR_ID), 10)});
				this.model.on("validated:valid", function() { this.hideErrors(); }, this);

				this.timeSheetCol = this.options.timesheetcollection;
			},

			render:function (eventName) {
				var now = new Date();

				$(this.el).html(this.template({})).i18n();
				this.stickit();

				renderMobiscrollDate({
					inputs: [$('#timesheetdate', this.el)],
					minDate: new Date(now.getFullYear()-1, now.getMonth(), now.getDate()),
					maxDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
				});
				return this;
			},

			events: {
				"focusout .ui-input-text" : "scrollAjustInput"
			},

			scrollAjustInput: function () {
				if (isIOS()) {
					setTimeout(function() {
						if ($('.ui-input-text', this.el).is(':focus'))
							return;
						$.mobile.silentScroll(window.pageYOffset);
					}, 50);
				}
			},

			save: function () {
				var self = this;

				if(this.validated()){
					$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
					//Crida a sincro de timesheet per poder baixar les dades relacionades de GOT
					var getParte = new PartesUp({
						date: this.model.get('date'),
						workDateTypeForOUId: this.model.get('workDateTypeForOUId'),
						vehicleRegistration: this.model.get('vehicleRegistration')
					});
					self._sync(getParte, {
						success: function() {
							app.back();
						},
						error: function(error) {
							$.mobile.loading('hide');
							//Missatge de no s'ha pogut crear el parte - tornar a intentar
							//Mirar si hi ha error
							if(!_.isUndefined(error)){
								self.showErrorMessage($('.errors', this.el), { parte: error });
							}else{
								self.showErrorMessage($('.errors', this.el), { parte: "error.parteNoObtenido" });
							}
						}
					});
				}
			},

			_sync: function (getParte, callbacks) {
				//Abans de cridar el syncroPartes s'hauria de fer un sincroUp
				new SyncGotMobile().syncroProcessGetParte(getParte, {
					success: function () {
						callbacks.success();
					},
					error: function (error) {
						callbacks.error(error);
					}
				});
			},

			validated: function () {
				var errors = {};

				if (!_.isUndefined(this.model.validate())){
					_.extend(errors, this.model.validate());
					this.showErrorMessage($('.errors', this.el), errors);
					return false;
				}else{
					if(this._existParte()){
						this.showErrorMessage($('.errors', this.el), { parte: "error.parteRepetit" });
						return false;
					}
					return true;
				}
			},

			_existParte: function () {
				var exist = _.findWhere(this.timeSheetCol.toJSON(), {date: this.model.get('date'), technicalOperatorId: this.model.get('technicalOperatorId')});
				if ( _.isUndefined(exist) ) {
					return false;
				}else{
					return true;
				}
			}
	});

	var FormCreateTimeSheetPage = Backbone.View.extend({
		idPage: ID_PAGE.CREARPARTE,
		subviews: {},

		initialize:function () {
			this.template = _.template(jqmPageTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));

			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'crearparte.title',
				idPage: this.idPage,
				menuBtns: this.initMenuHeaderBtns(),
				headerExtraBtns: this.initHeaderExtraBtns(),
				showMenuListBtn: false
			}).render();

			this.subviews.formCreateTSView = new FormCreateTSView({
				el: $('#page-content', this.el),
				model: this.options.timeSheet,
				timesheetcollection: this.options.timeSheetCollections,
				timeSheetWorkDateType: this.options.TimeSheetWorkDateTypeCollections
			}).render();

			return this;
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

		save: function () {
			this.subviews.formCreateTSView.save();
		}

	});

	return FormCreateTimeSheetPage;

});