define(['jquery', 'underscore', 'backbone.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/question.html', 'jqm'],
	function($, _, Backbone, Header, jqmPageTpl, questionTpl) {

	var Question = Backbone.View.extend({
		numQuestions: 0,
		
		initialize:function () {
			console.log(JSON.stringify(this.model, null, 4));
			console.log(JSON.stringify(this.collection, null, 4));
			this.template = _.template(questionTpl);
			this.questionData = {
				questionA: 'pregunta',
				answera: 'A',
				answerb: 'B',
				answerc: 'C',
				answerd: 'D'
			};
		},
		
		render:function (eventName) {
			this.updateQuestionData();
			$(this.el).html(this.template(this.questionData)).i18n();
			return this;
		},

		updateQuestionData: function() {
			console.log("updateQuestionData");
			this.questionData.questionA = this.model.get('description');
			this.questionData.answera = this.collection.models[0].get('description');
			this.questionData.answerb = this.collection.models[1].get('description');
			this.questionData.answerc = this.collection.models[2].get('description');
			this.questionData.answerd = this.collection.models[3].get('description');
		},

		events: {
			"click #answera_btn": "doAnswerA",
			"click #answerb_btn": "doAnswerB",
			"click #answerc_btn": "doAnswerC",
			"click #answerd_btn": "doAnswerD"
		},

		doAnswerA: function() {
			this.doAnswer(0);
		},
		doAnswerB: function() {
			this.doAnswer(1);
		},
		doAnswerC: function() {
			this.doAnswer(2);
		},
		doAnswerD: function() {
			this.doAnswer(3);
		},
		
		doAnswer: function(answer) {
			//check answer
			if (this.collection.models[answer].get('correct') && this.numQuestions<10){
				this.numQuestions++;
				//add points
				this.addPoints();
			}else{
				this.doEnd();
			};
		},
		
		addPoints: function() {
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			var statistic = new Statistic();
			console.log('navigate end');
			//this.nextQuestion();			
		},
		
		nextQuestion: function(){
			this.model = new Question();
			this.model.getRandomByCategory(initData.objectId,{
				success: function () { 
					console.log("q2:"+this.model.id);
					this.collection = new AnswerCollection();
					this.collection.findByQuestion(this.model,callbacks);
					callbacks.success();
				},
				error: function () { callbacks.error(); }
			});
		},

		doEnd: function() {
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			console.log('navigate end');
			app.navigate('statistics', true);
		}		
		
	});

	var QuestionPage = Backbone.View.extend({
		idPage: ID_PAGE.QUESTION,
		subviews: {},

		initialize:function () {
			console.log('QuestionPage-ini');
			this.template = _.template(jqmPageTpl);
		},

		render:function (eventName) {
			console.log('QuestionPage-render');
			$(this.el).html(this.template({headerFixed: true}));

			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'question.title',
				idPage: this.idPage,
				showBackBtn: true,
				showUserInfo: false,
				showMenuListBtn: false
			}).render();

			this.subviews.menuView = new Question({
				el: $('#page-content', this.el),
				model: this.options.question,
				collection: this.options.answerCollections
			}).render();

			return this;
		}
	});

	return QuestionPage;

});