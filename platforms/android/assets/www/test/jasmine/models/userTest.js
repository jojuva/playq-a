describe('Model :: User', function() {

  var mockData = { username: 'Foo', password: 'Bar' };

  beforeEach(function() {
    var that = this,
        done = false;

    require(['models/playUser'], function(PlayUser) {
      that.user = new PlayUser(mockData);
      done = true;
    });

    waitsFor(function() {
      return done;
    }, "Create Models");

  });

  describe('.Create()', function() {

    it('should create a user', function() {
      var done = false;
      this.user.save(mockData, {
        success: function() {
          done = true;
        }
      });

      waitsFor(function() { return done; });

      runs(function(){
        expect(this.user).not.toBe(null);
        expect(this.user.get('username')).toEqual('Foo');
        expect(this.user.get('password')).toEqual('Bar');
        expect(this.user.id).toEqual(jasmine.any(String));
      });

    });

  });

  describe('.Destroy()', function() {

    it('should destroy a user', function() {
      var done = false;
      this.user.save(mockData, {
	      success: function(user) {
	          user.destroy({
	              success: function() {
	                done = true;
	              }
	            });
	      }
	    });

      waitsFor(function() { return done; });

      runs(function(){
        expect(this.user.existed()).toBe(false);
      });

    });

  });  


  describe('.Fetch()', function() {

    it('should fetch a user', function() {
      var done = false;
      this.user.save(mockData, {
	      success: function(user) {
	          user.fetch({
	              success: function() {
	                done = true;
	              }
	            });
	      }
	    });

      waitsFor(function() { return done; });

      runs(function(){
        expect(this.user.existed()).toBe(true);
      });

    });

  });
  
});