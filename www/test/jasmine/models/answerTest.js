describe('Model :: Answer', function() {

  var mockData = { name: 'Foo', description: 'Bar' };

  beforeEach(function() {
    var that = this,
        done = false;

    require(['models/answer','collections/answerCollections'], function(Answer,AnswerCollection) {
      that.answers = new AnswerCollection();
      that.answer = new Answer(mockData);
      done = true;
    });

    waitsFor(function() {
      return done;
    }, "Create Models");

  });

  describe('.Create()', function() {

    it('should create a answer', function() {
      var done = false;
      this.answer = this.answers.create(mockData, {
        success: function() {
          done = true;
        }
      });

      waitsFor(function() { return done; });

      runs(function(){
        expect(this.answer).not.toBe(null);
        expect(this.answer.get('name')).toEqual('Foo');
        expect(this.answer.get('description')).toEqual('Bar');
        expect(this.answer.id).toEqual(jasmine.any(String));
      });

    });

  });

  describe('.Destroy()', function() {

    it('should destroy a answer', function() {
      var done = false;
      this.answer = this.answers.create(mockData, {
	      success: function(answer) {
	          answer.destroy({
	              success: function() {
	                done = true;
	              }
	            });
	      }
	    });

      waitsFor(function() { return done; });

      runs(function(){
        expect(this.answer.existed()).toBe(false);
      });

    });

  });  


  describe('.Fetch()', function() {

    it('should fetch a answer', function() {
      var done = false;
      this.answer = this.answers.create(mockData, {
	      success: function(answer) {
	          answer.fetch({
	              success: function() {
	                done = true;
	              }
	            });
	      }
	    });

      waitsFor(function() { return done; });

      runs(function(){
        expect(this.answer.existed()).toBe(true);
      });

    });

  });
  
});