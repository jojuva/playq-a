define(['underscore', 'backbone', 'sync/dao/PresenceDAO', 'moment'], function(_, Backbone, PresenceDAO, moment){
	var Presence = Backbone.Model.extend({

		dao: PresenceDAO,
		idAttribute: 'presenceid',

		defaults: {
			presenceid : null,
			pdausertechnicaloperator : null,
			technicaloperatorid : null,
			starttime : null,
			endtime : null,
			taskid : null
		},
		validation: {
			starttime: { required: true, msg: 'error.validation.starttime.required' },
			endtime: { required: true, msg: 'error.validation.endtime.required' }
		},
		getDuracion: function(){
			if(!_.isNull(this.get('endtime')) && !_.isNull(this.get('starttime'))){
				return moment((this.get('endtime')).toString(), "YYYY-MM-DDTHH:mm:ss") - moment((this.get('starttime')).toString(), "YYYY-MM-DDTHH:mm:ss");
			}else{
				return '';
			}
		}
	});
	return Presence;
});