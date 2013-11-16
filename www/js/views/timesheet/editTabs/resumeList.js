define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'moment', 'utils', 'collections/timesheet/TSProductiveCollections', 'text!templates/timesheet/editTabs/resume/resumeItemList.html', 'jqm'],
	function($, _, Backbone, stickit, moment, utils, TSProductiveCollection, resumeItemTpl) {

	var ResumeItemList = Backbone.View.extend({
		hourDesc: null,
		duration: null,
		tagName: 'li',

		initialize: function() {
			this.template = _.template(resumeItemTpl);
			this.duration = this.options.durationHour;
			if(!_.isNull(this.duration)){
				this.duration = moment.utc(this.duration).format("HH:mm");
			}
			this.hourDesc = this.options.hour;
		},
		
		renderItem: function(eventName) {
			this.parent.refreshList();
		},

		render: function (eventName) {
			$(this.el).html(this.template({hourDesc: this.hourDesc, duration: this.duration})).i18n();
			$(this.el).trigger('create');
			return this;
		}
	});

	var ResumeList = Backbone.View.extend({
		intervals: null,
		hourCol:null,
		tasks: null,
		intervalType: null,

		initialize: function(){
			var self =this;
			if(this.options.intervalType === "productive"){
				this.intervals = this.options.productiveCol;
			}else{
				this.intervals = this.options.noProductiveCol;
			}
			this.intervals.bind("change add remove reset", this.renderList, this);
			this.hourCol = this.options.hourTypes;
			this.intervalType = this.options.intervalType;
		},

		render:function (eventName) {
			this.renderList();
			return this;
		},

		_countDuration: function (intervals){
			var sum = '';
			_.each(intervals, function(interval){
				if(sum !== ''){
					sum = interval.getDuracion() + moment(sum);
				}else{
					sum = interval.getDuracion();
				}
			});
			return sum;
		},

		renderList: function (){
			var self = this,
				hours = _.uniq(this.intervals.pluck('hourTypeForOpUnitId'));

			$pList = $('#resume-'+this.intervalType+'-list', this.el);
			$pList.find('li:gt(0)', this.el).remove();

			if(this.intervals.models.length === 0) {
				$pList.append('<li>'+ $.t('timesheet.empty-interval-'+this.options.intervalType) +'</li>');
				try {
					$pList.listview('refresh');
				} catch(e) {
					// no need refresh
				}
			} else {
				_.each(hours, function(hourType){
					var hourDesc = '-';
					//passem hourType i passem duracioTotal
					prod_hour = self.intervals.where({hourTypeForOpUnitId : hourType});
					var suma = self._countDuration(prod_hour);

					if(!_.isUndefined(self.hourCol.get(hourType))) {
						hourDesc = self.hourCol.get(hourType).get('description');
					}
					view = new ResumeItemList({
						hour: hourDesc,
						durationHour: suma
					});
					$pList.append(view.render().el);
				});
				
				try {
					$pList.listview('refresh');
				} catch(e) {
					// no need refresh
				}
			}
			this.refreshTotalHours();
		},

		refreshTotalHours: function () {
			var total = this.intervals.getTotal(),
				hores;
			if(total !== ''){
				hores = moment.utc(total).format("HH:mm")+'h';
			} else {
				hores = '00:00h';
			}
			$('#resume-'+this.intervalType+'-total', this.el).html(hores);
		},
	});
	return ResumeList;
});