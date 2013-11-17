define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'moment',  'utils', 'collections/timesheet/TSProductiveCollections', 'text!templates/timesheet/editTabs/productive/editPopup/editItemListPopup.html', 'jqm'],
	function($, _, Backbone, stickit, moment, utils, TSProductiveCollection, editItemlistTpl) {


		/** POPUP Edit Task Intervals **/
	var EditIntervalItemList = Backbone.View.extend({
		parent: null,
		modelInterval: null,
		tagName: 'li',
		typeInt: null,
		bindings:{
			"[id*='interval-init']" : {
				observe: 'startDate',
				onGet: 'dateFormat'
			},
			"[id*='interval-end']" : {
				observe: 'endDate',
				onGet: 'dateFormat'
			},
			"[id*='interval-duration']" :{
				observe: ['startDate', 'endDate'],
				onGet: 'getDuration'
			},
			"[id*='interval-hourType']": {
				observe: 'hourTypeForOpUnitId',
				onGet: 'descTimeType'
			}
		},
		getDuration: function(values){
			if(!_.isNull(this.modelInterval)){
				if(!_.isNull(values[0]) && !_.isNull(values[1])){
					return moment.utc(this.modelInterval.getDuracion()).format("HH:mm");
				}else{
					return '-';
				}
			}else{
				return '-';
			}
		},
		dateFormat: function(value){
			if (!_.isNull(value)){
				if(!_.isString(value)){
					value = value.toString();
				}
				return moment(value, "YYYYMMDDHHmmss").format('HH:mm');
			}else{
				return '';
			}
		},
		descTimeType: function(value){
			//Tenim l'id, hem de passar el name
			//Si l'id no existeix, passem un -
			if(!_.isUndefined(this.options.timeSheetHourTypeCol.get(value)))
				return this.options.timeSheetHourTypeCol.get(value).get('description');
			else
				return '-';
		},

		initialize: function () {
			this.template = _.template(editItemlistTpl);
			this.parent = this.options.parent;
			this.modelInterval = this.options.model;
			this.typeInt = this.options.typeInt;
		},

		render:function (eventName) {
			$(this.el).html(this.template({intervalid: this.modelInterval.cid, typeInt: this.typeInt})).i18n();
			this.stickit();
			return this;
		},

		events : {
			"click a[id^=edit-interval-]" : "editInterval",
			"click a[id^=delete-interval-]" : "deleteInterval"
		},

		editInterval: function (event) {
			this.parent.editInterval(this.model);
		},

		deleteInterval: function (event) {
			this.parent.removeInterval(this.model);
		}
	});

	var EditIntervalListView = Backbone.View.extend({
		parent: null,
		modelTask: null,
		presenceAux: null,
		typeInt: null,

		initialize:function () {
			this.modelTask = this.options.modelTask;
			this.presenceAux = this.options.presenceAux;
			if(!_.isNull(this.presenceAux)){
				this.presenceAux.bind("change add reset remove", this.renderIntervals, this);
			}
			this.parent = this.options.parent;
			this.typeInt = this.options.typeInt;
		},

		render:function (eventName) {
			this.renderIntervals();
			return this;
		},

		renderIntervals: function () {
			this.hideErrorMessage($('#error_list', this.el));
			var presenceTask = null;
			
			if(!_.isUndefined(this.presenceAux) && !_.isNull(this.presenceAux)){

				if(this.typeInt === INTERVAL.PRODUCTIVE){
					$iList = $('#interval-list', this.el);
					presenceTask = new TSProductiveCollection(this.presenceAux.where({taskId: this.modelTask.get('taskId')}));
				}else{
					$iList = $('#noProductive-list', this.el);
					presenceTask = this.presenceAux;
				}
				$iList.find('li:gt(0)', this.el).remove();
				if (presenceTask.size() === 0) {
					$iList.hide();
				}
				else {
					$iList.show();
					presenceTask.each(function(interval) {
						view = new EditIntervalItemList({
							model: interval,
							parent: this,
							timeSheetHourTypeCol: this.options.timeSheetHourTypeCol,
							typeInt: this.typeInt
						});
						$iList.append(view.render().el);
						interval.bind('remove', view.remove);
					}, this);
					try {
						$iList.listview('refresh');
					} catch(e) {
						// no need refresh
					}
				}
				if(this.typeInt === INTERVAL.NO_PRODUCTIVE){
					var total = this.presenceAux.getTotal(),
						hores = null;
					if(total !== ''){
						hores = moment.utc(total).format("HH:mm")+'h';
					}else{
						hores = '00:00h';
					}
					$('#noProductive-total', this.el).html(hores);
				}
			}
		},

		removeInterval: function(model){
			if(this.typeInt === INTERVAL.NO_PRODUCTIVE){
				this.presenceAux.remove(model);
			}else{
				//Per les productives, minim hi ha d'haver un interval per tasca, sino no deixem borrar
				if(this.presenceAux.where({taskId : model.get('taskId')}).length > 1){
					this.presenceAux.remove(model);
				}else{
					this.showErrorMessage($('#error_list', this.el), { presence: "error.minPresence"});
				}
			}
		},

		editInterval: function (model) {
			this.parent.editInterval(model);
		}
	});

	return EditIntervalListView;
});