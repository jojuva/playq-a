define(['underscore', 'backbone.extend', 'sync/dao/questionDAO'], 
  function(_, Backbone, QuestionDAO){
	var Question = Backbone.Model.extend({
		dao: QuestionDAO,
		idAttribute: 'objectId',

		defaults: {
			objectId: null,
			name: null,
			description: null,
			score: null,
			categories: null,
			answers: null,
			createdAt: null
		},

		initialize: function() {
		},

		validation: {
			objectId: { required: true, msg: 'error.obligatorios' },
			name: { required: true, msg: 'error.obligatorios' },
			description: { required: true, msg: 'error.obligatorios' }
		}.
		
		getDuracion: function(){
			//return moment(this.get('endDate')).diff(moment(this.get('startDate')));
			if(!_.isNull(this.get('endDate')) && !_.isNull(this.get('startDate'))){
				return moment((this.get('endDate')).toString(), "YYYYMMDDHHmmss") - moment((this.get('startDate')).toString(), "YYYYMMDDHHmmss");
			}else{
				return '';
			}
		}

	});
	return Question;
});