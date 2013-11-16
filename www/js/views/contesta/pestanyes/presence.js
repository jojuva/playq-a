define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend','mobiscroll', 'moment', 'models/presence', 'text!templates/contesta/presence/presenceContent.html', 'text!templates/contesta/presence/presenceForm.html', 'text!templates/contesta/presence/presenceItemList.html', 'jqm'],
	function($, _, Backbone, stickit, mobiscroll, moment, Presence, presenceContentTpl, presenceFormTpl, presenceItemListTpl) {

	var PresenceItemList = Backbone.View.extend({
		parent: null,
		bindings:{
			'#presenceTime' : {
				observe: ['starttime', 'endtime'],
				updateMethod: 'html',
				onGet: 'dateFormat'
			}
		},
		dateFormat: function(values){
			if(!_.isNull(values[0]) && !_.isNull(values[1]))
				return '<span class="bold">' + moment(values[0], "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY") + '</span><br /><span class="text">'+moment(values[0], "YYYY-MM-DDTHH:mm:ss").format("HH:mm")+" - "+moment(values[1], "YYYY-MM-DDTHH:mm:ss").format("HH:mm")+' ('+moment.utc(this.model.getDuracion()).format("HH:mm")+' h) </span>';
			else
				return '-';
		},
		tagName: 'li',

		initialize: function() {
			this.template = _.template(presenceItemListTpl);
			this.model.bind('remove', this.remove);
			this.parent = this.options.parent;
		},

		render: function (eventName) {
			$(this.el).html(this.template({PresenceID: this.model.cid})).i18n();
			$(this.el).trigger('create');
			this.stickit();
			return this;
		},events : {
			"click a[id^=edit-presence-]" : "editPresence",
			"click a[id^=delete-presence-]" : "removePresence"
		},

		removePresence: function (event) {
			$(event.currentTarget).trigger('btnClick');
			this.parent.removePresence(this.model);
		},
		editPresence: function (event){
			$(event.currentTarget).trigger('btnClick');
			this.parent.editPresence(this.model);
		}

	});


	var PresenceListView = Backbone.View.extend({
		presenceCollection: null,
		parent: null,

		initialize:function () {
			this.presenceCollection = this.collection;
			if (!_.isUndefined(this.presenceCollection) && !_.isNull(this.presenceCollection)) {
				this.presenceCollection.bind("reset add remove", this.renderPresence, this);
			}
			this.parent = this.options.parent;
		},

		render:function (eventName) {
			this.renderPresence();
			return this;
		},

		renderPresence: function () {
			if (_.isUndefined(this.presenceCollection) || _.isNull(this.presenceCollection)) {
				return;
			}

			$pList = $('#presence-list', this.el);
			$pList.find('li:gt(0)', this.el).remove();
			if (this.presenceCollection.size() === 0) {
				$pList.hide();
			}
			else {
				$pList.show();
				this.presenceCollection.each(function(presence) {
					view = new PresenceItemList({
						model: presence,
						parent: this
					});
					$pList.append(view.render().el);
					presence.bind('remove', view.remove);
				}, this);
				
				try {
					$pList.listview('refresh');
				} catch(e) {
					// no need refresh
				}
			}
		},

		removePresence: function(model){
			this.presenceCollection.remove(model);
		},

		editPresence: function(model){
			this.parent.editPresence(model);
		}
	});

	var PresenceForm = Backbone.View.extend({
		presenceNew: null,
		presenceEdit: null,
		task: null,
		taskid: null,

		bindings:{
			'#datePresence' : {
				observe: 'date',
				onGet: 'getDatePresence',
				onSet: 'setTimings'
			},
			'#starttime' : {
				observe: 'starttime',
				onSet: 'setDate',
				onGet: 'getTime'
			},
			'#endtime' : {
				observe: 'endtime',
				onSet: 'setDate',
				onGet: 'getEndTime'
			}
		},
		getDatePresence: function(value){
			if(!_.isNull(value) && !_.isEmpty(value)){
				return moment(value, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY");
			}else{
				//return moment(this.task.get('initialdatereal'), "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY");
				return moment().format("DD/MM/YYYY");
			}
		},
		getTime: function(value){
			if(!_.isNull(value)){
				return moment(value, "YYYY-MM-DDTHH:mm:ss").format("HH:mm");
			}else{
				//return moment(this.task.get('initialdatereal'), "YYYY-MM-DDTHH:mm:ss").format("HH:mm");
				return moment().format("YYYY-MM-DDTHH:mm:ss").format("HH:mm");
			}
		},
		getEndTime: function(value){
			if(!_.isNull(value)){
				return moment(value, "YYYY-MM-DDTHH:mm:ss").format("HH:mm");
			}
		},
		setDate: function(value){
			//unim el valor de datePresence amb el que ens torna...
			if (!_.isNull(value) && !_.isUndefined(value)){
				value = $("#datePresence", this.el).val()+value;
				return moment(value, "DD/MM/YYYYHH:mm").format("YYYY-MM-DDTHH:mm:ss");
			}
		},
		setTimings: function(value){
			if (!_.isNull(value) && !_.isUndefined(value)){
				this.presenceNew.set({ 'starttime': moment(value,"DD/MM/YYYY").format("YYYY-MM-DDT")+$("#starttime", this.el).val()+":00" });
				this.presenceNew.set({'endtime' : moment(value,"DD/MM/YYYY").format("YYYY-MM-DDT")+$("#endtime", this.el).val()+":00"});
			}
			return moment(value,"DD/MM/YYYY").format("YYYY-MM-DDTHH:mm:ss");
		},

		initialize:function() {
			this.template = _.template(presenceFormTpl);
			this.taskid = this.options.task.get('taskid');
			this.task = this.options.task;
			this.presenceNew = new Presence(this.getPresenceNewData());
		},

		getPresenceNewData: function () {
			return {
				taskid: this.taskid,
				//starttime: this.task.get('initialdatereal'),
				//date: this.task.get('initialdatereal')
				starttime: moment().format("YYYY-MM-DDT") + moment(this.task.get('initialdatereal'), "YYYY-MM-DDTHH:mm:ss").format("HH:mm:ss"),
				date: moment().format("YYYY-MM-DDTHH:mm:ss")
			};
		},

		render:function (eventName) {
			var now = new Date();
			$(this.el).html(this.template()).i18n();
			this.stickit(this.presenceNew);
			/* datePresence - starttime / endtime - visió del data i dels time*/
			var editI = window.localStorage.getItem(LS_EDIT_INIT_DATE);
			var editF = window.localStorage.getItem(LS_EDIT_FINAL_DATE);
			if(editI === "false"){
				$('#datePresence', this.el).textinput().textinput('disable');
				$('#starttime', this.el).textinput().textinput('disable');
			}
			if(editF === "false"){
				$('#endtime', this.el).textinput().textinput('disable');
			}
			renderMobiscrollDate({
				inputs: [$('#datePresence', this.el)],
				minDate: new Date(now.getFullYear()-1, now.getMonth(), now.getDate()),
				maxDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
				disabled: (editI === "false")
			});

			renderMobiscrollTime({
				inputs: [ $('#starttime', this.el) ],
				maxDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()),
				disabled: (editI === "false")
			});

			renderMobiscrollTime({
				inputs: [ $('#endtime', this.el) ],
				maxDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()),
				disabled: (editF === "false")
			});
			
			return this;
		},

		events:{
			"click #crear_presence" : "addPresence",
			"click #cancel_editar_presence" : "cancelEdit",
			"click #editar_presence" : "editPresence",
			"focusout #starttime" : "scrollAjust",
			"focusout #endtime" : "scrollAjust"
		},

		_setAddButtons: function(){
			$("[id*='editar_presence']", this.el).hide();
			$("[id*='cancel_editar_presence']", this.el).hide();
			$("[id*='crear_presence']", this.el).show();
		},

		_setEditButtons: function(){
			$("[id*='crear_presence']", this.el).hide();
			$("[id*='editar_presence']", this.el).show();
			$("[id*='cancel_editar_presence']", this.el).show();
		},

		scrollAjust: function() {
			if (isIOS()) {
				$.mobile.silentScroll(window.pageYOffset);
			}
		},

		addPresence: function(event){
			event.preventDefault();
			event.stopPropagation();
			$(event.currentTarget).trigger('btnClick');
			this.checkValidPresence(this.collection.models, "add");
		},

		editPresence: function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(event.currentTarget).trigger('btnClick');
			var nonEditPresences = this.collection.without(this.presenceEdit);
			this.checkValidPresence(nonEditPresences, "edit");
		},

		checkValidPresence: function(presences, mode) {
			if (!_.isUndefined(errorVal = this.presenceNew.validate())){
				this.showErrors(errorVal);
			}
			else {
				var solapa = comprobarPresencias(presences, this.presenceNew.get('starttime'), this.presenceNew.get('endtime'));
				if(solapa === null){
					this.unstickit(this.presenceNew);
					if (mode === "add") {
						this.collection.add(new Presence(this.presenceNew.omit('date')));
					} else if (mode === "edit") {
						this.presenceEdit.set(this.presenceNew.omit('date'));
					}
					this.resetForm();
				} else {
					var errorMsg = {error: { text: solapa, i18n: false }};
					this.showErrorMessage($('#errors-solapa', this.el), errorMsg);
				}
			}
		},

		presenceEnd: function(){
			var now = moment().format("HH:mm");
			this.presenceNew.set({
				endtime: this.getPresenceEndTime(this.presenceNew.get('date'))
			});
		},

		renderEdit: function(model) {
			this.presenceEdit = model;
			this.hideErrors();
			this.hideErrorMessage($('#errors-solapa', this.el));
			this.unstickit();
			this.presenceNew.set(model.toJSON());
			this.presenceNew.set({ date: model.get('starttime') });
			this.stickit(this.presenceNew, this.bindings);

			this._setEditButtons();

			return this;
		},

		resetForm: function() {
			this.unstickit();
			
			/*var dataSet = {
				taskid: this.taskid,
				starttime: this.task.get('initialdatereal'),
				endtime: this.getPresenceEndTime(this.task.get('initialdatereal')),
				date: this.task.get('initialdatereal')
			};*/

			this.presenceNew.set(this.presenceNew.defaults);
			this.presenceNew.set(this.getPresenceNewData());
			this.stickit(this.presenceNew, this.bindings);
			this._setAddButtons();
			this.hideErrors();
			this.hideErrorMessage($('#errors-solapa', this.el));
		},

		getPresenceEndTime: function (date) {
			var now = moment().format("HH:mm");
			return moment(date, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDT')+now+':00';
		},

		cancelEdit: function(event) {
			event.preventDefault();
			event.stopPropagation();
			this.resetForm();
		}
	});

	var PresenceContent = Backbone.View.extend({
		subviews: {},

		initialize:function(){
			this.template = _.template(presenceContentTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({edited: this.options.edited})).i18n();

			this.subviews.presenceForm = new PresenceForm({
				el: $('#presence-form', this.el),
				collection: this.collection,
				task: this.options.task
			}).render();

			this.subviews.presenceList = new PresenceListView({
				el: $('#content-list', this.el),
				collection: this.collection,
				parent: this
			}).render();

			return this;
		},

		"events" : {
			"expand #presence-collapsible" : "presenceEnd"
		},

		presenceEnd: function(event) {
			event.preventDefault();
			event.stopPropagation();
			this.subviews.presenceForm.presenceEnd();
		},

		editPresence: function(model) {
			this.subviews.presenceForm.renderEdit(model);
		}
	});

	return PresenceContent;
});