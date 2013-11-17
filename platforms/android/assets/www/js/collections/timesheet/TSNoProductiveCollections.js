define(['underscore', 'backbone', 'models/timesheet/TSNoProductive', 'sync/dao/timesheet/TSNoProductiveDAO'], function(_, Backbone, TSNoProductive, TSNoProductiveDAO){
	var TSNoProductiveCollection = Backbone.Collection.extend({
		model: TSNoProductive,
		dao: TSNoProductiveDAO,
		comparator: function(model) {
			return model.get('startDate');
		},
		findByTimeSheet: function(timeSheet, callbacks) {
			var self = this;

			new this.dao(window.db).findByTimeSheet(timeSheet, {
				success: function (noProductive, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(noProductive);
					callbacks.success();
				},
				error: callbacks.error
			});
		},
		getTotal: function(){
			var sum = '';
			_.each(this.models, function(interval){
				if(sum !== ''){
					sum = interval.getDuracion() + moment(sum);
				}else{
					sum = interval.getDuracion();
				}
			});
			return sum;
		}
	});
	return TSNoProductiveCollection;
});