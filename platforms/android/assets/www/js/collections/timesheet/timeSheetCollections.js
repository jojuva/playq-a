define(['underscore', 'backbone', 'models/timesheet/timeSheet', 'sync/dao/timesheet/TimeSheetDAO'], function(_, Backbone, TimeSheet, TimeSheetDAO){
	var TimeSheetCollection = Backbone.Collection.extend({
		model: TimeSheet,
		dao: TimeSheetDAO,
		deleteTimeSheet: function(model, callbacks) {
			var self = this;
			window.db.transaction(
				function (tx) {
					new self.dao(window.db).deleteRow(tx, model);
				},
				function (error) { callbacks.error(error.code); },
				function () {
					self.reset();
					callbacks.success();
				}
			);
		},
		findFinalized: function(callbacks) {
			var self = this;
			new this.dao(window.db).findFinalized({
				success: function (timesheet, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(timesheet);
					callbacks.success();
				},
				error: callbacks.error
			});
		}
	});
	return TimeSheetCollection;
});