describe('Model :: Question', function() {

  var mockData = { name: 'Foo', description: 'Bar', score: 5 };

  beforeEach(function() {
    var that = this,
        done = false;

    require(['models/question','collections/questionCollections'], function(Question,QuestionCollection) {
      that.questions = new QuestionCollection();
      that.question = new Question(mockData);
      done = true;
    });

    waitsFor(function() {
      return done;
    }, "Create Models");

  });

  describe('.Create()', function() {

    it('should create a question', function() {
      var done = false;
      this.question = this.questions.create(mockData, {
        success: function() {
          done = true;
        }
      });

      waitsFor(function() { return done; });

      runs(function(){
        expect(this.question).not.toBe(null);
        expect(this.question.get('name')).toEqual('Foo');
        expect(this.question.get('description')).toEqual('Bar');
        expect(this.question.get('score')).toEqual(5);
        expect(this.question.id).toEqual(jasmine.any(String));
      });

    });

  });

  describe('.Destroy()', function() {

    it('should destroy a question', function() {
      var done = false;
      this.question = this.questions.create(mockData, {
	      success: function(question) {
	          question.destroy({
	              success: function() {
	                done = true;
	              }
	            });
	      }
	    });

      waitsFor(function() { return done; });

      runs(function(){
        expect(this.question.existed()).toBe(false);
      });

    });

  });  


  describe('.Fetch()', function() {

    it('should fetch a question', function() {
      var done = false;
      this.question = this.questions.create(mockData, {
	      success: function(question) {
	          question.fetch({
	              success: function() {
	                done = true;
	              }
	            });
	      }
	    });

      waitsFor(function() { return done; });

      runs(function(){
        expect(this.question.existed()).toBe(true);
      });

    });

  });
  
});