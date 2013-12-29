define(['jquery', 'underscore', 'backbone.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/question.html', 'models/statistic', 'models/ranking', 'jqm'],
	function($, _, Backbone, Header, jqmPageTpl, questionTpl, Statistic, Ranking) {

	var Question = Backbone.View.extend({
		numQuestions: null,
		
		initialize:function () {
			this.numQuestions=this.options.numQuestions;
			console.log('numQuestions-ini:'+this.numQuestions);
			//console.log(JSON.stringify(this.model, null, 4));
			//console.log(JSON.stringify(this.collection, null, 4));
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
			var self = this;
			
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			//check answer
			if (this.collection.models[answer].get('correct')){
				if (window.localStorage.getItem(LS_QUESTION_IDS) == ""){
					window.localStorage.setItem(LS_QUESTION_IDS,this.model.id);
					console.log("QIDS:"+window.localStorage.getItem(LS_QUESTION_IDS));
				}else{
					window.localStorage.setItem(LS_QUESTION_IDS,window.localStorage.getItem(LS_QUESTION_IDS)+','+this.model.id);
					console.log("QIDS:"+window.localStorage.getItem(LS_QUESTION_IDS));				
				}
				//add points
				this.numQuestions++;
				this.addPoints(this.model.get('score'),1,0,this.numQuestions,{
					success: function(){
						console.log('numQuestions:'+self.numQuestions);
						if (self.numQuestions<10){
							self.doTraining();
						}else{
							self.doEnd('OK');
						}
					},
					error: function(){
						console.log('error adding points.');
					}
						
				});
			}else{
				//add points
				this.addPoints(0,0,1,0,{
					success: function(){
						self.doEnd('KO');
					},
					error: function(){
						console.log('error adding points.');
					}
				});
			};
		},
		
		addPoints: function(score,ok,ko,strike,callbacks) {
			var statistic = new Statistic();
			statistic.getMyStatistic({
				success: function(){
					statistic.set('totScore',statistic.get('totScore')+score);
					statistic.set('okAnswers',statistic.get('okAnswers')+ok);
					statistic.set('koAnswers',statistic.get('koAnswers')+ko);
					if (statistic.get('maxStrike')<=strike){
						statistic.set('maxStrike',strike);
					}
					statistic.save();
					var ranking = new Ranking();
					ranking.getMyRanking({
						success: function(){
							ranking.set('score',ranking.get('score')+score);
							ranking.save();
						}
					});
					callbacks.success();
				},
				error: function(){
					console.log('error saving statistic.');
					callbacks.error();
				}
			});
		},
		
		doTraining: function() {
			console.log('doTraining');
			app.navigate('question/'+this.model.get('category').id+'/'+this.numQuestions, true);
		},

		doEnd: function(result) {
			console.log('doEnd');
			app.navigate('end', true);
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
				numQuestions: this.options.numQuestions,
				model: this.options.question,
				collection: this.options.answerCollections
			}).render();

			return this;
		}
	});

	return QuestionPage;

});