define(['underscore', 'backbone', 'sync/dao/ReadingRegisterDAO'], function(_, Backbone, ReadingRegisterDAO){
	var ReadingRegister = Backbone.Model.extend({

		dao: ReadingRegisterDAO,
		idAttribute: 'readingregisterid',

		defaults: {
			readingregisterid : null,
			yearperiod : null,
			readingdate : null,
			register : null,
			consumed : null,
			taskid : null
		}
	});
	return ReadingRegister;
});