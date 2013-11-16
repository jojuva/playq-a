define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'moment','mobiscroll', 'models/timesheet/TSTask', 'models/timesheet/TSResource', 'collections/timesheet/TSResourceCollections', 'views/timesheet/editTabs/formPLR', 'text!templates/timesheet/editTabs/plr/editPopup/editResourcesPopup.html', 'text!templates/timesheet/editTabs/plr/editPopup/editResourcesFormPopup.html',  'text!templates/timesheet/editTabs/plr/editPopup/editItemListPopup.html', 'jqm'],
	function($, _, Backbone, stickit, moment, mobiscroll, TSTask, TSResource, TSResourceCollections, EditPLRForm, editResourcesTpl, editResourcesFormTpl, editItemlistTpl, errorItemTpl) {

	var EditResourcesItemList = Backbone.View.extend({
		parent: null,
		tagName: 'li',
		bindings:{
			'#resource-idresource': {
				observe: 'resourceId',
				onGet: 'descResource'
			},
			'#resource-usage' : {
				observe: 'usage',
				onGet: 'dateFormat'
			}
		},
		dateFormat: function(value){
			if (!_.isNull(value)){
				value = value*60000;
				return moment.utc(value).format('HH:mm');
			}else{
				return '';
			}
		},
		descResource: function(value){
			//Tenim l'id, hem de passar el name
			//Si l'id no existeix, passem un -
			if(!_.isUndefined(this.options.resourceProtectionCol.get(value)))
				return this.options.resourceProtectionCol.get(value).get('resourcedescription');
			else
				return '-';
		},

		initialize: function () {
			this.template = _.template(editItemlistTpl);
			this.parent = this.options.parent;
		},

		render:function (eventName) {
			$(this.el).html(this.template({tsresourceid: this.model.get('tsresourceid')})).i18n();
			this.stickit();
			return this;
		},

		events : {
			"click a[id^=edit-resource-]" : "editResource",
			"click a[id^=delete-resource-]" : "deleteResource"
		},

		editResource: function (event) {
			this.parent.editResource(this.model);
		},

		deleteResource: function (event) {
			this.parent.removeResource(this.model);
		}
	});

	var EditResourceListView = Backbone.View.extend({
		parent: null,
		resourcesCollection: null,
		tstask : null,

		initialize:function () {
			this.tstask = this.options.model;
			this.resourcesCollection = this.options.resources;
			this.parent = this.options.parent;
			if(!_.isNull(this.resourcesCollection)){
				this.resourcesCollection.bind("reset change add remove", this.renderResources, this);
			}
		},

		render:function (eventName) {
			this.renderResources();
			return this;
		},

		renderResources: function () {
			$rList = $('#resource-list', this.el);
			$rList.find('li:gt(0)', this.el).remove();

			if (_.isNull(this.resourcesCollection) || this.resourcesCollection.size() === 0) {
				$rList.hide();
			}
			else {
				$rList.show();
				this.resourcesCollection.each(function(resource) {
					view = new EditResourcesItemList({
						model: resource,
						resourceProtectionCol: this.options.resourceProtectionCol,
						parent: this
					});
					$rList.append(view.render().el);
					resource.bind('remove', view.remove);
				}, this);
				try {
					$rList.listview('refresh');
				} catch(e) {
					// no need refresh
				}
			}
		},

		removeResource: function(model){
			this.resourcesCollection.remove(model);
		},

		editResource: function (model) {
			this.parent.editResource(model);
		}
	});

	var EditResourceForm = Backbone.View.extend({
		resourceNew: null,
		tsTask: null,
		bindings:{
			"#usage":{
				observe: 'usage',
				onGet: 'dateFormat',
				onSet: 'setDateFormat'
			},
			'#resourceId': {
				observe: 'resourceId',
				selectOptions: {
					collection: 'this.options.resourceProtectionCol',
					labelPath: 'resourcedescription',
					valuePath: 'resourceid',
					defaultOption: {
						label: $.t("select.defaultLabel"),
						value: null
					}
				}
			},
		},
		setDateFormat: function(value){
			if(!_.isNull(value)){
				var milisec = moment.duration(moment(value, "HH:mm"))._milliseconds;
				return parseInt(milisec/60000, 10);
			}
		},
		dateFormat: function(value){
			if (!_.isNull(value)){
				value = value*60000;
				return moment.utc(value).format('HH:mm');
			}else{
				return '00:00';
			}
		},

		initialize: function () {
			this.template = _.template(editResourcesFormTpl);
			this.tsTask = this.options.model;
			if(!_.isNull(this.tsTask)){
				this.resourceNew = new TSResource({date: this.tsTask.get('date')});
			}else{
				this.resourceNew = new TSResource();
			}
			this.resourceNew.on("validated:invalid", function (model, errors) {
				this.showErrors(errors);
				if (!_.isUndefined(errors.usage) && !_.isEmpty(errors.usage)) {
					this.showErrorMessage($('#errors-resourcesForm'), { text: 'error.validation.date.required' });
				}
			}, this);
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();
			this.renderMobiscroll();
			return this;
		},

		renderMobiscroll: function(){
			renderMobiscrollTime({inputs: [ $('#usage', this.el) ]});
			$('#usage', this.el).mobiscroll('setValue','00:00');
		},

		renderEdit: function(model){
			this.hideErrors();
			this.hideErrorMessage($('#errors-resourcesForm', this.el));
			this.unstickit();
			this.renderMobiscroll();

			this.resourceEdit = model;
			this.resourceNew.set(model.toJSON());
			this.stickit(this.resourceNew, this.bindings);
			
			$("select", this.el).selectmenu("refresh", true);
			this._setEditButtons();
		},

		resetForm: function() {
			this.hideErrors();
			this.hideErrorMessage($('#errors-resourcesForm', this.el));
			this.unstickit();
			
			var dataSet = {};
			if(!_.isUndefined(this.tsTask) && !_.isNull(this.tsTask)){
				dataSet.taskId = this.tsTask.get('taskId');
				dataSet.date = this.tsTask.get('date');
			}
			this.resourceNew.set(this.resourceNew.defaults);
			this.resourceNew.set(dataSet);
			this.stickit(this.resourceNew, this.bindings);
			
			this._setAddButtons();
			this.resetSelect();
		},

		resetSelect: function() {
			$("select", this.el).each(function(i, element) {
				$(element).val('-1').attr('selected', true).siblings('option').removeAttr('selected');
				try {
					$(element).selectmenu("refresh", true);
				} catch (e) {}
			});
		},

		_setAddButtons: function(){
			$("[id*='editar_resource']", this.el).hide();
			$("[id*='cancel_editar_resource']", this.el).hide();
			$("[id*='crear_resource']", this.el).show();
		},

		_setEditButtons: function(){
			$("[id*='crear_resource']", this.el).hide();
			$("[id*='editar_resource']", this.el).show();
			$("[id*='cancel_editar_resource']", this.el).show();
		},

		events: {
			"click a[id^='crear_resource']" : "addResource",
			"click a[id^='editar_resource']" : "editResource",
			"click a[id^='cancel_editar_resource']" : "cancelEdit"
		},

		addResource: function(event){
			event.preventDefault();
			event.stopPropagation();
			this.checkValidResource('add');
		},

		editResource: function(event){
			event.preventDefault();
			event.stopPropagation();
			this.checkValidResource('edit');
		},

		checkValidResource: function(mode) {
			this.hideErrors();
			this.hideErrorMessage($('#errors-resourcesForm', this.el));
			if(this.resourceNew.isValid(true)) {
				if (mode === 'add') {
					this.options.resources.add(new TSResource(this.resourceNew.toJSON()));
				}
				else if (mode === 'edit') {
					this.resourceEdit.set(this.resourceNew.toJSON());
				}
				this.resetForm();
			} else {
				this.resourceNew.validate();
			}
		},

		cancelEdit: function(event){
			event.preventDefault();
			event.stopPropagation();
			this.resetForm();
			this.renderMobiscroll();
		}
	});

	var PLRPopup = Backbone.View.extend({
		subviews: {},
		tstask: null,
		resources: null,
		taskEdited: null,
		closeCallback: null,

		bindings: {
			"#tstask-accountcode" : "accountCode",
			"#tstask-desc" : "taskDescription",
			"#tstask-address" :"realAddress"
		},

		initialize: function () {
			this.template = _.template(editResourcesTpl);
			this.tstask = new TSTask();
			this.resources = new TSResourceCollections();
			this.closeCallback = this.options.closeCallback;
		},

		render: function (eventName) {
			$(this.el).html(this.template({})).i18n();
			this.renderSubviews();
			return this;
		},

		renderSubviews: function (eventName) {
			this.subviews.editPLRForm = new EditPLRForm({
				el:$('#popup-form-plr', this.el),
				model: this.tstask
			}).render();

			this.subviews.editResourceForm = new EditResourceForm({
				el:$('#popup-form-resource', this.el),
				model: this.tstask,
				resources: this.resources,
				resourceProtectionCol: this.options.resourceProtectionCol
			}).render();

			this.subviews.editResourceListView = new EditResourceListView({
				el:$('#popup-list-resource', this.el),
				model: this.tstask,
				resources: this.resources,
				resourceProtectionCol: this.options.resourceProtectionCol,
				parent: this
			}).render();

			return this;
		},

		openPopup: function (model) {
			//fem un new del tstask perquè es pugui cancelar
			this.taskEdited = model;
			this.unstickit();
			this.tstask.set(model.toJSON());
			this.resources.reset(this.tstask.get('tsresource').toJSON());
			this.resetForm();
			this.stickit(this.tstask, this.bindings);
			scroll(0);
			this.$el.show();
		},

		resetForm: function () {
			this.subviews.editPLRForm.resetForm();
			this.subviews.editResourceForm.resetForm();
		},

		editResource: function (model) {
			this.subviews.editResourceForm.renderEdit(model);
		},

		events: {
			"click #cancel-editResources" : "cancelAction",
			"click #accept-editResources" : "acceptAction"
		},

		cancelAction: function (event) {
			this.closePopup();
		},

		acceptAction: function (event) {
			var validation = this.subviews.editPLRForm.validateForm();
			if(validation === true){
				//setejem els atributs editables al popup
				this.taskEdited.set({
					asbestosCuts: this.tstask.get('asbestosCuts'),
					asbestosDuration: this.tstask.get('asbestosDuration'),
					asbestosExposition: this.tstask.get('asbestosExposition'),
					confinedSpaces: this.tstask.get('confinedSpaces')
				});
				//reset de la collection de tsresource
				this.taskEdited.get('tsresource').reset(this.resources.toJSON());
				this.taskEdited.trigger("repaint");
				this.subviews.editResourceForm.resetForm();
				this.closePopup();
			}
		},
		closePopup: function () {
			this.subviews.editResourceForm.resetForm();
			this.$el.hide();
			if (!_.isUndefined(this.closeCallback) && !_.isNull(this.closeCallback)) {
				this.closeCallback();
			}
		}
	});
	return PLRPopup;
});