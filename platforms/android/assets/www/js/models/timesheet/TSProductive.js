define(['underscore', 'backbone.extend', 'moment', 'sync/dao/timesheet/TSProductiveDAO'], function(_, Backbone, moment, TSProductiveDAO){
	var TSProductive = Backbone.Model.extend({
		dao: TSProductiveDAO,
		//idAttribute: 'tsproductiveid',

		defaults: {
			tsproductiveid: null,
			taskId: null,
			hourTypeForOpUnitId: null,
			date: null,
			technicalOperatorId: null,
			startDate: null,
			endDate: null
		},
		getDuracion: function(){
			//return moment(this.get('endDate')).diff(moment(this.get('startDate')));
			if(!_.isNull(this.get('endDate')) && !_.isNull(this.get('startDate'))){
				return moment((this.get('endDate')).toString(), "YYYYMMDDHHmmss") - moment((this.get('startDate')).toString(), "YYYYMMDDHHmmss");
			}else{
				return '';
			}
		},
		validation: {
			startDate: { required: true, msg: 'error.validation.startDate.required' },
			endDate: { required: true, msg: 'error.validation.endDate.required' },
			hourTypeForOpUnitId: { required: true, msg: 'error.validation.hourTypeForOpUnitId.required' }
		}

	});
	return TSProductive;
});