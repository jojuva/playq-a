define(['underscore', 'backbone', 'sync/dao/timesheet/TSTaskDAO', 'models/timesheet/TSProductive'], function(_, Backbone, TSTaskDAO, TSProductive){
	var TSTask = Backbone.Model.extend({
		dao: TSTaskDAO,
		idAttribute: 'tstaskid',

		defaults: {
			tstaskid: null,
			taskDescription: null,
			technicalOperatorId: null,
			date: null,
			taskId: null,
			asbestosCuts: null,
			asbestosDuration: null,
			asbestosExposition: null,
			confinedSpaces: null,
			accountCode: null,
			realAddress: null,
			taskTypeId: null,
			//collections
			tsproductivetime: null,
			tsresource: null
		},
		initialize: function(attrs, opcions) {
			if (!_.isUndefined(attrs) && !_.isUndefined(attrs.confinedSpaces)) {
				if(!Boolean(attrs.confinedSpaces)){
					this.set({confinedSpaces: JSON.parse(attrs.confinedSpaces.toLowerCase())});
				}
			}
		},
		parse: function (response) {
			console.log('parsE! '+response);
			this.attributes.confinedSpaces = Boolean(response.get('confinedSpaces'));
			return {};
		},
		getIntervaloGlobal: function(){
			var prodTimeGlobal = new TSProductive({ startDate : this.get('tsproductivetime').first().get('startDate'), endDate: this.get('tsproductivetime').last().get('endDate') });
			return prodTimeGlobal;
		},
		getDuracionTotal: function(){
			var duracion = 0;

			_.each(this.get('tsproductivetime').models, function(tsproductive) {
				duracion = duracion + tsproductive.getDuracion();
			}, this);

			return duracion;
		},
		getStartDate: function(){
			if(!_.isNull(this.get('tsproductivetime')) && !_.isEmpty(this.get('tsproductivetime'))){
				return this.get('tsproductivetime').first().get('startDate');
			}else{
				return '';
			}
		}

	});
	return TSTask;
});