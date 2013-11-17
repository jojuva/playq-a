define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'mobiscroll', 'moment', 'models/master/operator', 'models/operatorTask', 'text!templates/contesta/operators/operatorsContent.html', 'text!templates/contesta/operators/operatorsForm.html', 'text!templates/contesta/operators/operatorsItemList.html', 'jqm'],
	function($, _, Backbone, stickit, mobiscroll, moment, Operator, OperatorTask, operatorsContentTpl, operatorsFormTpl, operatorItemListTpl) {

	var OperatorItemList = Backbone.View.extend({
		parent: null,
		bindings:{
			'#date' : {
				observe: 'adddate',
				onGet: 'dateFormat'
			},
			'#name': { observe: 'userid', onGet: 'userName' }
		},
		dateFormat: function(value){
			if (!_.isNull(value) && !_.isEmpty(value))
				return moment(value, "YYYY-MM-DD").format('DD/MM/YYYY');
			else
				return '';
		},
		userName: function(value){
			//Tenim l'id, hem de passar el name. Si l'id no existeix, passem un -
			if(!_.isUndefined(this.options.operarios.get(value)))
				return this.options.operarios.get(value).get('name');
			else
				return '-';
		},
		tagName: 'li',

		initialize: function() {
			this.template = _.template(operatorItemListTpl);
			this.model.bind('remove', this.remove);
			this.parent = this.options.parent;
		},

		render: function (eventName) {
			$(this.el).html(this.template({operatortaskid: this.model.cid})).i18n();
			$(this.el).trigger('create');
			this.stickit();
			return this;
		},

		events : {
			"click a[id^=delete-operator-]" : "removeOperator"
		},

		removeOperator: function (event) {
			$(event.currentTarget).trigger('btnClick');
			this.parent.removeOperator(this.model);
		}

	});


	var OperatorsListView = Backbone.View.extend({
		operatortaskCollection: null,

		initialize:function () {
			this.operatortaskCollection = this.options.operatortask;
			this.operatortaskCollection.bind("reset add remove", this.renderOperators, this);
			this.addFirstOperator();
		},

		addFirstOperator: function () {
			var self = this,
				operator = new Operator({userid: window.localStorage.getItem(LS_OPERATOR_ID)});
			// comprovació que existeix operari a la taula de mestres
			operator.fetch({
				success: function() {
					// afegim operari actual amb data d'avui si no existeix
					var operatorTask = self.operatortaskCollection.findWhere({ userid: operator.id, adddate: moment().format('YYYY-MM-DD') });
					if (_.isUndefined(operatorTask)) {
						self.operatortaskCollection.add({
							'id': {operatorid: operator.id},
							'adddate': moment().format('YYYY-MM-DD'),
							'taskid': self.options.task.get('taskid')
						});
					}
				},
				error: function () {}
			});
		},

		render:function (eventName) {
			this.renderOperators();
			return this;
		},

		renderOperators: function () {
			$opList = $('#operators-list', this.el);
			$opList.find('li:gt(0)', this.el).remove();
			if (this.operatortaskCollection.size() === 0) {
				$opList.hide();
			}
			else {
				$opList.show();
				this.operatortaskCollection.each(function(operator) {
					view = new OperatorItemList({
						model: operator,
						parent: this,
						operarios: this.options.operarios
					});
					$opList.append(view.render().el);
					operator.bind('remove', view.remove);
				}, this);
				try {
					$opList.listview('refresh');
				} catch(e) {
					// no need refresh
				}
			}
		},

		removeOperator: function(model){
			this.operatortaskCollection.remove(model);
		}
	});

	var OperatorsForm = Backbone.View.extend({
		operarios: null,
		operatortask: null,
		operatorNew: null,
		taskid: null,

		bindings:{
			'#operarios': {
				observe: 'userid',
				selectOptions: {
					collection: 'this.options.operarios',
					labelPath: 'name',
					valuePath: 'userid',
					defaultOption: {
						label: $.t("select.defaultLabel"),
						value: null
					}
				}
			},
			'#adddate' : {
				observe: 'adddate',
				onGet: 'getDate',
				onSet: 'setDate'
			}
		},

		getDate: function(value){
			if(!_.isNull(value))
				return moment(value, "YYYY-MM-DD").format('DD/MM/YYYY');
		},

		setDate: function(value){
			if(!_.isNull(value)){
				return moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
			}else{
				return null;
			}
		},

		initialize:function () {
			this.template = _.template(operatorsFormTpl);
			this.operarios = this.options.operarios;
			this.operatortask = this.options.operatortask;
			this.taskid = this.options.task.get('taskid');
			this.operatorNew = new OperatorTask({taskid: this.taskid});
		},

		render:function (eventName) {
			var now = new Date();
			$(this.el).html(this.template()).i18n();
			this.stickit(this.operatorNew, this.bindings);
			/*adddate - visió del datatime*/
			renderMobiscrollDate({
				inputs: [$('#adddate', this.el)],
				minDate: new Date(now.getFullYear()-1, now.getMonth(), now.getDate()),
				maxDate: new Date(now.getFullYear(), now.getMonth(), now.getDate())
			});

			return this;
		},

		events:{
			"click #crear_operator" : "addOperator",
			"focusout #adddate" : "scrollAjust"
		},

		scrollAjust: function() {
			if (isIOS()) {
				$.mobile.silentScroll(window.pageYOffset);
			}
		},

		addOperator: function(event){
			event.preventDefault();
			event.stopPropagation();
			$(event.currentTarget).trigger('btnClick');

			if (_.isUndefined(this.operatortask) || _.isUndefined(this.operatorNew)) {
				return;
			}

			if(!_.isUndefined(errors = this.operatorNew.validate())) {
				this.showErrors(errors);
				return;
			}

			//validació interna: mirem si l'usuari ja ha estat inserit amb la mateixa data, sino: error
			var duplicat = this.operatortask.findWhere(this.operatorNew.pick('userid', 'adddate'));
			if (!_.isUndefined(duplicat)) {
				var errorMsg = { text: 'error.operariosDuplicados' };
				this.showErrorMessage($('#errors-operari-solapa', this.el), errorMsg);
				return;
			}

			this.operatortask.add(_.omit(this.operatorNew.toJSON(), 'userid'));
			this.resetForm();
		},

		resetForm: function() {
			this.hideErrors();
			this.hideErrorMessage($('#errors-operari-solapa', this.el));
			$("#operarios option", this.el).attr("selected",false);
			$("#operarios option:first", this.el).attr("selected","selected");
			try {
				$('#operarios').selectmenu("refresh", true);
			} catch (e) {}
			this.unstickit(this.operatorNew);
			this.operatorNew = new OperatorTask({taskid: this.taskid});
			this.stickit(this.operatorNew, this.bindings);
		}
	});

	var OperatorsContent = Backbone.View.extend({
		subviews: {},

		initialize:function(){
			this.template = _.template(operatorsContentTpl);
		},

		render:function (eventName) {
			$(this.el).html(this.template({edited: this.options.edited})).i18n();

			this.subviews.operatorsForm = new OperatorsForm({
				el:$('#operators-form', this.el),
				operatortask: this.options.operatortask,
				operarios: this.options.collection,
				task: this.options.task
			}).render();

			this.subviews.operatorsList = new OperatorsListView({
				el: $('#content-list', this.el),
				operatortask: this.options.operatortask,
				operarios: this.options.collection,
				task: this.options.task
			}).render();

			return this;
		}
	});

	return OperatorsContent;
});