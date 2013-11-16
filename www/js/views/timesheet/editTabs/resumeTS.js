define(['jquery', 'underscore.extend', 'backbone.extend',  'backbone.stickit.extend', 'moment', 'utils', 'collections/timesheet/TSProductiveCollections','views/timesheet/editTabs/resumeList', 'text!templates/timesheet/editTabs/resume/resumeContent.html', 'jqm'],
	function($, _, Backbone, stickit, moment, utils, TSProductiveCollection, ResumeList, resumeContentTpl) {

	var ResumeTotalHours = Backbone.View.extend({
		productive: null,
		noproductive: null,

		initialize: function(){
			var self = this;
			this.productive = this.options.productiveCol;
			this.productive.bind("change add remove reset", this.render, this);
			
			this.noproductive = this.options.noProductiveCol;
			this.noproductive.bind("change add remove reset", this.render, this);
		},

		render: function (eventName) {
			var total = '',
				hores = null;
			if(this.productive.getTotal() !== ''){
				total = this.productive.getTotal();
			}
			if(this.noproductive.getTotal() !== ''){
				total = total +this.noproductive.getTotal();
			}
				
			if(total !== ''){
				hores = moment.utc(total).format("HH:mm")+'h';
			}else{
				hores = '00:00h';
			}
			$('#resume-dedication-total', this.el).html(hores);
			return this;
		}
	});

	var ResumeDiet = Backbone.View.extend({
		timeSheet: null,

		initialize: function (){
			this.timeSheet = this.options.timeSheet;
			this.timeSheet.bind("change", this.render, this);
		},

		render: function (eventName) {
			if( !isNaN(this.timeSheet.get('expenses')) ) {
				var expenses = this.timeSheet.get('expenses').toString().replace('.', ',') + " €";
				$('#resume-diet', this.el).html(expenses);
			}
			return this;
		}
	});

	var ResumeObservation = Backbone.View.extend({
		timeSheet: null,

		initialize: function () {
			this.timeSheet = this.options.timeSheet;
			this.timeSheet.bind("change", this.render, this);
		},

		render: function (eventName) {
			$('#resume-observation', this.el).html(this.timeSheet.get('observation'));
			return this;
		}
	});

	var ResumeContent = Backbone.View.extend({
		subviews: {},
		timeSheet: null,
		noProductive : null,
		productive : null,

		initialize: function(){
			this.template = _.template(resumeContentTpl);
			this.timeSheet = this.options.model;
			this.productive = this.options.productiveCol;
		},

		render: function (eventName) {
			$(this.el).html(this.template()).i18n();

			this.subviews.resumeProductive = new ResumeList({
				el:$('#resumeProductive', this.el),
				productiveCol: this.productive,
				hourTypes: this.options.timeSheetHourProdTypeCol,
				intervalType: 'productive'
			}).render();

			this.subviews.resumeNoProductive = new ResumeList({
				el:$('#resumeNoProductive', this.el),
				productiveCol: null,
				noProductiveCol: this.options.noProductiveCol,
				hourTypes: this.options.timeSheetHourNoProdTypeCol,
				intervalType: 'noproductive'
			}).render();

			this.subviews.resumeTotalHours = new ResumeTotalHours({
				el:$("#resumeTotal", this.el),
				productiveCol: this.productive,
				noProductiveCol: this.options.noProductiveCol
			}).render();

			this.subviews.resumeDiet = new ResumeDiet({
				el:$("#resumeDiet", this.el),
				timeSheet: this.timeSheet
			}).render();

			this.subviews.resumeObservation = new ResumeObservation({
				el:$("#resumeObservation", this.el),
				timeSheet: this.timeSheet
			}).render();
			return this;
		}
	});

	return ResumeContent;
});