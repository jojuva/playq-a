define(['underscore', 'backbone', 'models/master/gauge', 'sync/dao/master/GaugeDAO'], function(_, Backbone, Gauge, GaugeDAO){
	var GaugeCollection = Backbone.Collection.extend({
		Gauge: Gauge,
		dao: GaugeDAO
	});
	return GaugeCollection;
});