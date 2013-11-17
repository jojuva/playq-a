define(['underscore', 'backbone', 'sync/dao/master/GaugeDAO'], function(_, Backbone, GaugeDAO){
	var Gauge = Backbone.Model.extend({

		dao: GaugeDAO,
		idAttribute: 'gaugeid',

		defaults: {
			gaugeid : null,
			gaugevalue : null,
			isdelete : null
		}
	});
	return Gauge;
});