define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'moment', 'models/timesheet/TSTask', 'text!templates/timesheet/editTabs/plr/plrContent.html', 'text!templates/timesheet/editTabs/plr/plrItemList.html', 'jqm'],
	function($, _, Backbone, stickit, moment, TSTask, plrContentTpl, plrItemListTpl) {

	var TaskPLRItemList = Backbone.View.extend({
		parent: null,
		tagName: 'li',
		bindings:{
			'#plr_accountCode' : {
				observe: 'accountCode'
			},
			'#plr_task-date-duration' : {
				observe: 'date',
				onGet: 'getIntervalGlobal'
			},
			'#plr_task-desc' : 'taskDescription',
			'#plr_task-address' : 'realAddress',
			'#failures' : {
				observe : 'asbestosCuts',
				updateMethod: 'html',
				onGet : 'iconFailures'
			},
			'#plr' : {
				observe : ['tsresource', 'confinedSpaces'],
				updateMethod: 'html',
				onGet : 'iconResources'
			}
		},
		getIntervalGlobal: function(value){
			if(!_.isNull(this.model.get('tsproductivetime'))){
				var intervalo = this.model.getIntervaloGlobal();
				var duracion = this.model.getDuracionTotal();

				return moment((intervalo.get('startDate')).toString(), 'YYYYMMDDHHmmss').format('HH:mm')+'-'+moment((intervalo.get('endDate')).toString(), 'YYYYMMDDHHmmss').format('HH:mm')+'  '+moment.utc(duracion).format("HH:mm");
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
		iconFailures: function(value){
			if(!_.isNull(value)){
				if(value !== 0){
					return "<span class='ui-icon ui-icon-ok-sign icon-green'></span>";
				}
			}
			//retornem un no
			return "<span class='ui-icon ui-icon-remove-sign icon-red'></span>";
		},
		iconResources: function(values){
			if((!_.isNull(values[0]) && !_.isEmpty(values[0]) && values[0].size()>0) || (!_.isNull(values[1]) && values[1].toString() === "true")){
					return "<span class='ui-icon ui-icon-ok-sign icon-green'></span>";
			}
			//retornem un no
			return "<span class='ui-icon ui-icon-remove-sign icon-red'></span>";
		},
		
		initialize: function() {
			this.template = _.template(plrItemListTpl);
			this.model.bind('remove', this.remove);
			this.parent = this.options.parent;
		},

		render: function (eventName) {
			$(this.el).html(this.template({tstaskid: this.model.get('tstaskid')})).i18n();
			this.stickit();
			$(this.el).trigger('create');
			return this;
		},

		events : {
			"click a[id^=edit-plr-]" : "editPLR"
		},

		editPLR: function (event) {
			/*popup*/
			this.parent.editPLR(this.model);
		}
	});

	var TaskPLRListView = Backbone.View.extend({
		taskCollection: null,
		parent: null,

		initialize:function () {
			if(!_.isUndefined(this.options.model) && !_.isNull(this.options.model.get('tsTask'))){
				this.taskCollection = this.options.model.get('tsTask');
			}
			this.taskCollection.bind("reset add remove repaint", this.renderTaskPRL, this);
			this.parent = this.options.parent;
		},

		render:function (eventName) {
			this.renderTaskPRL();
			return this;
		},

		renderTaskPRL: function () {
			$pList = $('#plr-list', this.el);
			$pList.find('li:gt(0)', this.el).remove();
			if (this.taskCollection.size() === 0) {
				$pList.hide();
			}
			else {
				$pList.show();
				this.taskCollection.each(function(task) {
					view = new TaskPLRItemList({
						model: task,
						parent: this
					});
					$pList.append(view.render().el);
				}, this);
				try {
					$pList.listview('refresh');
				} catch(e) {
					// no need refresh
				}
			}
		},

		editPLR: function(model){
			this.parent.showEditResourcesPopup(model);
		}
	});

	var TaskPLRContent = Backbone.View.extend({
		subviews: {},

		initialize:function(){
			this.template = _.template(plrContentTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();
			this.renderSubViews(eventName);
			return this;
		},

		renderSubViews: function (eventName) {
			this.subviews.taskPLRListView = new TaskPLRListView({
				el:$('#content-task-list', this.el),
				model: this.options.model,
				parent: this
			}).render();
		},

		showEditResourcesPopup: function (model){
			this.options.parent.openPLRPopup(model);
		}
	});

	return TaskPLRContent;
});