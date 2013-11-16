define(['underscore', 'backbone', 'models/internal/foto'],
	function(_, Backbone, Foto){

	var FotoCollection = Backbone.Collection.extend({
		model: Foto,

		comparator: function(model1, model2) {
			var data1 = moment(model1.get('data'), "DD/MM/YYYY HH:mm:ss").format("YYMMDDHHmmss");
			var data2 = moment(model2.get('data'), "DD/MM/YYYY HH:mm:ss").format("YYMMDDHHmmss");

			if (data1 > data2) return -1; // before
			if (data2 > data1) return 1; // after
			return 0; // equal
		}
	});
	return FotoCollection;
});