define(['underscore', 'backbone', 'models/internal/log', 'sync/dao/internal/LogDAO'],
	function(_, Backbone, Log, LogDAO){

	var LogCollection = Backbone.Collection.extend({
		model: Log,
		dao: LogDAO,
		deleteLog: function(callbacks) {
				var self = this;
				window.db.transaction(
					function (tx) {
						new self.dao(window.db).deleteAllRows(tx);
					},
					function (error) { callbacks.error(error.code); },
					function () {
						self.reset();
						callbacks.success();
					}
				);
			}
	});
	return LogCollection;
});