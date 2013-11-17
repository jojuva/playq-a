define(['underscore', 'backbone', 'sync/dao/timesheet/TSNoProductiveDAO'], function(_, Backbone, TSNoProductiveDAO){
	var TSNoProductive = Backbone.Model.extend({
		dao: TSNoProductiveDAO,
		idAttribute: 'tsnoproductiveid',

		defaults: {
			tsnoproductiveid: null,
			hourTypeForOpUnitId: null,
			date: null,
			technicalOperatorId: null,
			startDate: null,
			endDate: null
		},
		getDuracion: function(){
			//return moment(this.get('endDate')).diff(moment(this.get('startDate')));
			return moment((this.get('endDate')).toString(), "YYYYMMDDHHmmss") - moment((this.get('startDate')).toString(), "YYYYMMDDHHmmss");
		},
		validation: {
			startDate: { required: true, msg: 'error.validation.startDate.required' },
			endDate: { required: true, msg: 'error.validation.endDate.required' },
			hourTypeForOpUnitId: { required: true, msg: 'error.validation.hourTypeForOpUnitId.required' }
		}

	});
	return TSNoProductive;
});