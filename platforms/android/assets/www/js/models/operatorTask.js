define(['underscore', 'backbone', 'sync/dao/OperatorTaskDAO'], function(_, Backbone, OperatorTaskDAO){
	var OperatorTask = Backbone.Model.extend({

		dao: OperatorTaskDAO,
		idAttribute: 'operatortaskid',

		defaults: {
			operatortaskid: null,
			taskid: null,
			id: {operatorid: null}, //userid
			adddate : null
		},

		set: function (attrs, values) {
			var val;
			if (attrs === 'userid') {
				attrs = {userid: values};
				values = undefined;
			}

			if (!_.isUndefined(attrs.userid)) {
				var src = {id : {operatorid: attrs.userid} };
				_.extend(attrs,  src);
			}

			return Backbone.Model.prototype.set.call(this, attrs, values);
		},

		get: function(attr) {
			if (attr === 'userid') {
				return this.attributes.id.operatorid;
			} else {
				return Backbone.Model.prototype.get.call(this, attr);
			}
		},

		validation: {
			adddate: { required: true },
			userid: { required: true }
		}
	});
	return OperatorTask;
});