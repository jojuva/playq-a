describe('Model :: Category', function() {

  var mockData = { name: 'Foo Bar' };

  beforeEach(function() {
    var that = this,
        done = false;

    require(['models/category','collections/categoryCollections'], function(Category,CategoryCollection) {
      that.categories = new CategoryCollection();
      that.category = new Category(mockData);
      done = true;
    });

    waitsFor(function() {
      return done;
    }, "Create Models");

  });

  describe('.Create()', function() {

    it('should create a category', function() {
      var done = false;
      this.category = this.categories.create(mockData, {
        success: function() {
          done = true;
        }
      });

      waitsFor(function() { return done; });

      runs(function(){
        expect(this.category).not.toBe(null);
        expect(this.category.get('name')).toEqual('Foo Bar');
        expect(this.category.id).toEqual(jasmine.any(String));
      });

    });

  });

  describe('.Destroy()', function() {

    it('should destroy a category', function() {
      var done = false;
      this.category = this.categories.create(mockData, {
	      success: function(category) {
	          category.destroy({
	              success: function() {
	                done = true;
	              }
	            });
	      }
	    });

      waitsFor(function() { return done; });

      runs(function(){
        expect(this.category.existed()).toBe(false);
      });

    });

  });  


  describe('.Fetch()', function() {

    it('should fetch a category', function() {
      var done = false;
      this.category = this.categories.create(mockData, {
	      success: function(category) {
	          category.fetch({
	              success: function() {
	                done = true;
	              }
	            });
	      }
	    });

      waitsFor(function() { return done; });

      runs(function(){
        expect(this.category.existed()).toBe(true);
      });

    });

  });
  
});