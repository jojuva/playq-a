define(['underscore', 'backbone', 'models/Question', 'sync/dao/QuestionDAO'], 
  function(_, Backbone, Question, QuestionDAO){
	var TSProductiveCollection = Backbone.Collection.extend({
		model: Question,
		dao: QuestionDAO,
		
		comparator: function(model) {
			return model.get('name');
		},
		getProdByTask: function(taskId, date, callbacks) {
			var self = this;

			new this.dao(window.db).findByTask(taskId, date, {
				success: function (Productive, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(Productive);
					if (callbacks.success) callbacks.success();
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
		},
		getProdByHour: function(hourId, date, userId, callbacks){
			var self = this;

			new this.dao(window.db).findByHour(hourId, date, userId, {
				success: function (Productives, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					var sum = '';
					_.each(Productives, function(productive){
						p = new TSProductive(productive);
						sum = p.getDuracion() + moment(sum);
					});
					callbacks.success(sum);
				},
				error: function(){
					callbacks.error();
				}
			});
		},
		removeByTask: function(task) {
			var removeModels = this.where({taskId: task.get('taskId')});
			this.remove(removeModels);
		}
	});
	return TSProductiveCollection;
});